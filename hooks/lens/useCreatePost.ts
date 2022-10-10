import { ethers } from "ethers";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { toastOn } from "../../lib/toasts";

import { Metadata } from "../../types/metadata";
import { useMutation } from "@apollo/client";
import useWaitForAction from "./useWaitForAction";
import { LENSHUB_PROXY_ABI } from "../../abis/LensProxy";
import { useProfile } from "../..//context/context";
import { Mutation, RelayerResult } from "../../types/index";
import BROADCAST_MUTATION from "../../graphql/broadcast/broadcast";
import { ERROR_MESSAGE, LENSHUB_PROXY, RELAYER_ON } from "../../lib/consts";
import CREATE_POST_SIG from "../../graphql/publications/create-post-request";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData,
} from "wagmi";
import { omit } from "lib/utils";

type CreatePost = {
  createPost: (url: string) => Promise<() => Promise<unknown>>;
  loading: boolean;
  error?: Error;
};
type CreatePostOptions = { onSuccess?: () => void; onIndex?: () => void };

const useCreatePost = ({
  onSuccess,
  onIndex,
}: CreatePostOptions = {}): CreatePost => {
  const { chain } = useNetwork();
  const { profile } = useProfile();
  const { isConnected } = useAccount();

  //#region Data Hooks
  const [getTypedData, { loading: dataLoading, error: dataError }] =
    useMutation<{
      createPostTypedData: Mutation["createPostTypedData"];
    }>(CREATE_POST_SIG, {
      onError: (error) => toast.error(error.message ?? ERROR_MESSAGE),
    });
  const {
    signTypedDataAsync: signRequest,
    isLoading: sigLoading,
    error: sigError,
  } = useSignTypedData({
    onError: (error) => {
      toast.error(error.message ?? ERROR_MESSAGE);
    },
  });
  const {
    writeAsync: sendTx,
    data: txData,
    isLoading: txLoading,
    error: txError,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: LENSHUB_PROXY,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: "postWithSig",
    onError: (error: any) => {
      toast.error(error?.data?.message ?? error?.message);
    },
    onSuccess: () => {
      onSuccess && onSuccess();
    },
  });
  const [
    broadcast,
    { data: broadcastResult, loading: gasslessLoading, error: gasslessError },
  ] = useMutation<{
    broadcast: Mutation["broadcast"];
  }>(BROADCAST_MUTATION, {
    onCompleted({ broadcast }) {
      if ("reason" in broadcast) return toast.error(broadcast.reason);

      onSuccess && onSuccess();
    },
    onError() {
      toast.error(ERROR_MESSAGE);
    },
  });
  //#endregion

  const { resolveOnAction } = useWaitForAction({
    onParse: onIndex,
    txHash: txData?.hash,
    txId: (broadcastResult?.broadcast as RelayerResult)?.txId as string,
  });

  const createPost = useCallback(
    async (url) => {
      if (!isConnected) throw toast.error("Please connect your wallet first.");
      if (chain?.unsupported) throw toast.error("Please change your network.");
      if (!profile?.id)
        throw toast.error("Please create a Lens profile first.");
      console.log(url);
      const { id, typedData } = await toastOn(
        async () => {
          const {
            data: { createPostTypedData },
          } = await getTypedData({
            variables: {
              request: {
                profileId: profile.id,
                contentURI: url,
                collectModule: {
                  freeCollectModule: {
                    followerOnly: false,
                  },
                },
              },
            },
          });

          return createPostTypedData;
        },
        {
          loading: "Getting signature details...",
          success: "Signature is ready!",
          error: "Something went wrong! Please try again later",
        }
      );

      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
        deadline,
      } = typedData.value;

      const signature = await signRequest({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      });

      const { v, r, s } = ethers.utils.splitSignature(signature);

      if (RELAYER_ON) {
        const result = await toastOn(
          async () => {
            const {
              data: { broadcast: result },
            } = await broadcast({
              variables: {
                request: { id, signature },
              },
            });

            if ("reason" in result) throw result.reason;

            return result;
          },
          {
            loading: "Sending transaction...",
            success: "Transaction sent!",
            error: ERROR_MESSAGE,
          }
        );

        return resolveOnAction({ txId: result.txId });
      }

      const tx = await toastOn(
        () =>
          sendTx({
            recklesslySetUnpreparedArgs: {
              profileId,
              contentURI,
              collectModule,
              collectModuleInitData,
              referenceModule,
              referenceModuleInitData,
              sig: { v, r, s, deadline },
            },
          }),
        {
          loading: "Sending transaction...",
          success: "Transaction sent!",
          error: ERROR_MESSAGE,
        }
      );
      console.log(tx.hash);
      return resolveOnAction({ txHash: tx.hash });
    },
    [
      isConnected,
      chain?.unsupported,
      profile?.id,
      getTypedData,
      signRequest,
      broadcast,
      sendTx,
      resolveOnAction,
    ]
  );

  return {
    createPost,
    loading: dataLoading || sigLoading || txLoading || gasslessLoading,
    error: dataError || sigError || txError || gasslessError,
  };
};

export default useCreatePost;
