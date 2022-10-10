import { LENSHUB_PROXY_ABI } from "abis/LensProxy";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "@chakra-ui/react";

import {
  ALLOWANCE_SETTINGS_QUERY,
  BROADCAST_MUTATION,
  CHANNEL_FOLLOW_MODULE_QUERY,
} from "graphql/LEnstube";
import { CREATE_FOLLOW_TYPED_DATA } from "graphql/LEnstube";
import logger from "lib/logger";
import useAppStore from "lib/store";
import usePersistStore from "lib/store/persist";
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE,
} from "../../../lib/constants";
import { omit } from "../../../lib/utils";
import { utils } from "ethers";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { FeeFollowModuleSettings, Profile } from "../../../types";
import { useContractWrite, useSigner, useSignTypedData } from "wagmi";
import { useProfile } from "../../../context/context";

type Props = {
  channel: Profile;
  onJoin: () => void;
};

const JoinProfile: FC<Props> = ({ channel, onJoin }) => {
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [buttonText, setButtonText] = useState("Join Channel");
  const { profile } = useProfile();
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
    setButtonText("Join Channel");
  };

  const onCompleted = () => {
    onJoin();
    toast.success(`Joined ${channel.handle}`);
    setButtonText("Joined Channel");
    setLoading(false);
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError,
  });
  const { data: signer } = useSigner({ onError });

  const { write: writeJoinChannel } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: "followWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });

  const [broadcast] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError,
  });

  const { data: followModuleData } = useQuery(CHANNEL_FOLLOW_MODULE_QUERY, {
    variables: { request: { profileIds: channel?.id } },
    skip: !channel?.id,
  });
  const followModule: FeeFollowModuleSettings =
    followModuleData?.profiles?.items[0]?.followModule;

  useQuery(ALLOWANCE_SETTINGS_QUERY, {
    variables: {
      request: {
        currencies: followModule?.amount?.asset?.address,
        followModules: "FeeFollowModule",
        collectModules: [],
        referenceModules: [],
      },
    },
    skip: !followModule?.amount?.asset?.address || !profile.id,
    onCompleted(data) {
      setIsAllowed(
        data?.approvedModuleAllowanceAmount[0]?.allowance !== "0x00"
      );
    },
  });

  const [createJoinTypedData] = useMutation(CREATE_FOLLOW_TYPED_DATA, {
    async onCompleted(data) {
      const { typedData, id } = data.createFollowTypedData;
      try {
        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        });
        const { v, r, s } = utils.splitSignature(signature);
        const args = {
          follower: signer?.getAddress(),
          profileIds: typedData.value.profileIds,
          datas: typedData.value.datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        setUserSigNonce(userSigNonce + 1);
        if (RELAYER_ENABLED) {
          const { data } = await broadcast({
            variables: { request: { id, signature } },
          });
          if (data?.broadcast?.reason)
            writeJoinChannel?.({ recklesslySetUnpreparedArgs: args });
        } else {
          writeJoinChannel?.({ recklesslySetUnpreparedArgs: args });
        }
      } catch (error) {
        logger.error("[Error Join Channel Typed Data]", error);
      }
    },
    onError,
  });

  const joinChannel = () => {
    if (!profile.id) return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    if (!isAllowed)
      return toast.error(
        `Menu -> Settings -> Permissions and allow fee follow module for ${followModule?.amount?.asset?.symbol}.`
      );
    setLoading(true);
    setButtonText("Joining...");
    createJoinTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          follow: {
            profile: channel?.id,
            followModule: {
              feeFollowModule: {
                amount: {
                  currency: followModule?.amount?.asset?.address,
                  value: followModule?.amount?.value,
                },
              },
            },
          },
        },
      },
    });
  };

  const joinTooltipText = followModule ? (
    <span>
      Pay Membership of
      <b className="ml-1 space-x-1">
        <span>{followModule?.amount?.value}</span>
        <span>{followModule?.amount?.asset.symbol}</span>
      </b>
    </span>
  ) : (
   
  

    <Tooltip content={joinTooltipText} placement="top">
      <span>
        <Button onClick={() => joinChannel()} disabled={loading}>
          {buttonText}
        </Button>
      </span>
    </Tooltip>
  );
};

export default JoinProfile;
