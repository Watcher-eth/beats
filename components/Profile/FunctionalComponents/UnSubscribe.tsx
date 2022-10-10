import { FOLLOW_NFT_ABI } from "abis/FollowNFT";
import { useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import { BROADCAST_MUTATION } from "graphql/LEnstube";
import { CREATE_UNFOLLOW_TYPED_DATA } from "graphql/LEnstube";
import logger from "../../../lib/logger";
import usePersistStore from "lib/store/persist";
import { RELAYER_ENABLED, SIGN_IN_REQUIRED_MESSAGE } from "lib/constants";
import omitKey from "@utils/functions/omitKey";
import { omit } from "../../../lib/utils";
import { ethers, Signer, utils } from "ethers";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import {
  CreateBurnEip712TypedData,
  CreateUnfollowBroadcastItemResult,
  Profile,
} from "../../../types";
import { useSigner, useSignTypedData } from "wagmi";
import { useProfile } from "../../../context/context";

type Props = {
  channel: Profile;
  onUnSubscribe: () => void;
};

const UnSubscribe: FC<Props> = ({ channel, onUnSubscribe }) => {
  const subscribeType = channel?.followModule?.__typename;
  const subscribeText =
    subscribeType === "FeeFollowModuleSettings"
      ? "Joined channel"
      : "Following";
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState(subscribeText);

  const { profile } = useProfile();
  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message);
    setLoading(false);
    setButtonText(subscribeText);
  };
  const onCompleted = () => {
    toast.success(`Unfollowed ${channel.handle}`);
    onUnSubscribe();
    setButtonText(
      subscribeType === "FeeFollowModuleSettings" ? "Join channel" : "Follow"
    );
    setLoading(false);
  };

  const { data: signer } = useSigner({ onError });

  const { signTypedDataAsync } = useSignTypedData({
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

  const burnWithSig = async (
    signature: string,
    typedData: CreateBurnEip712TypedData
  ) => {
    const { v, r, s } = utils.splitSignature(signature);
    const sig = {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    };
    const followNftContract = new ethers.Contract(
      typedData.domain.verifyingContract,
      FOLLOW_NFT_ABI,
      signer as Signer
    );
    const txn = await followNftContract.burnWithSig(
      typedData?.value.tokenId,
      sig
    );
    if (txn.hash) onCompleted();
  };

  const [createUnsubscribeTypedData] = useMutation(CREATE_UNFOLLOW_TYPED_DATA, {
    async onCompleted(data) {
      const { typedData, id } =
        data.createUnfollowTypedData as CreateUnfollowBroadcastItemResult;
      try {
        const signature: string = await signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        });
        if (RELAYER_ENABLED) {
          const { data } = await broadcast({
            variables: { request: { id, signature } },
          });
          if (data?.broadcast?.reason) await burnWithSig(signature, typedData);
        } else {
          await burnWithSig(signature, typedData);
        }
      } catch (error) {
        setLoading(false);
        setButtonText(subscribeText);
        logger.error("[Error UnSubscribe Typed Data]", error);
      }
    },
    onError,
  });

  const unsubscribe = () => {
    if (!profile.id) return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    setLoading(true);
    setButtonText("Unsubscribing...");
    createUnsubscribeTypedData({
      variables: {
        request: { profile: channel?.id },
      },
    });
  };

  return (
    <Button
      color="white"
      bg="black"
      disabled={loading}
      onClick={() => unsubscribe()}
    >
      {buttonText}
    </Button>
  );
};

export default UnSubscribe;
