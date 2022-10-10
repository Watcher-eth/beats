import { LENSHUB_PROXY_ABI } from "abis/LensProxy";
import { useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import { BROADCAST_MUTATION } from "graphql/LEnstube";
import { PROXY_ACTION_MUTATION } from "graphql/proxy";
import { CREATE_FOLLOW_TYPED_DATA } from "graphql/LEnstube";
import logger from "../../../lib/logger";
import { useProfile } from "../../../context/context";
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
import { CreateFollowBroadcastItemResult, Profile } from "../../../types";
import { useContractWrite, useSigner, useSignTypedData } from "wagmi";

type Props = {
  channel: Profile;
  onSubscribe: () => void;
};

const Subscribe: FC<Props> = ({ channel, onSubscribe }) => {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Follow");
  const { profile } = useProfile();
  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
    setButtonText("Follow");
  };

  const onCompleted = () => {
    onSubscribe();
    toast.success(`Following ${channel.handle}`);
    setButtonText("Following");
    setLoading(false);
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError,
  });
  const { data: signer } = useSigner({ onError });

  const { write: writeSubscribe } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: "followWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });

  const [broadcast] = useMutation(BROADCAST_MUTATION, {
    onCompleted(data) {
      if (data?.broadcast?.reason !== "NOT_ALLOWED") {
        onCompleted();
      }
    },
    onError,
  });

  const [createProxyActionFreeFollow] = useMutation(PROXY_ACTION_MUTATION, {
    onError,
    onCompleted,
  });

  const [createSubscribeTypedData] = useMutation(CREATE_FOLLOW_TYPED_DATA, {
    async onCompleted(data) {
      const { typedData, id } =
        data.createFollowTypedData as CreateFollowBroadcastItemResult;
      try {
        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        });
        const { v, r, s } = utils.splitSignature(signature);
        const { profileIds, datas } = typedData?.value;
        const args = {
          follower: signer?.getAddress(),
          profileIds,
          datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        if (RELAYER_ENABLED) {
          const { data } = await broadcast({
            variables: { request: { id, signature } },
          });
          if (data?.broadcast?.reason)
            writeSubscribe?.({ recklesslySetUnpreparedArgs: args });
        } else {
          writeSubscribe?.({
            recklesslySetUnpreparedArgs: args,
          });
        }
      } catch (error) {
        logger.error("[Error Subscribe Typed Data]", error);
      }
    },
    onError,
  });

  const subscribe = () => {
    if (!profile.id) return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    setLoading(true);
    setButtonText("Subscribing...");
    if (channel.followModule) {
      return createSubscribeTypedData({
        variables: {
          request: {
            follow: {
              profile: channel?.id,
              followModule:
                channel?.followModule?.__typename ===
                "ProfileFollowModuleSettings"
                  ? { profileFollowModule: { profileId: profile?.id } }
                  : null,
            },
          },
        },
      });
    }
    createProxyActionFreeFollow({
      variables: {
        request: {
          follow: {
            freeFollow: {
              profileId: channel?.id,
            },
          },
        },
      },
    });
  };

  return (
    <Button
      h="40px"
      w="100px "
      borderRadius={"35px"}
      color="white"
      bg="gray.800"
      onClick={() => subscribe()}
      disabled={loading}
    >
      {buttonText}
    </Button>
  );
};

export default Subscribe;
