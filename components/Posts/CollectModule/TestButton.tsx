import { LENSHUB_PROXY_ABI } from "../../../abis/LensProxy";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Modal, Text, useDisclosure } from "@chakra-ui/react";
import Tooltip from "components/common/Tooltip";
import {
  BROADCAST_MUTATION,
  VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY,
} from "../../../graphql/LEnstube";
import { PROXY_ACTION_MUTATION } from "../../../graphql/proxy-action";
import { CREATE_COLLECT_TYPED_DATA } from "../../../graphql/createTypedData";
import logger from "../../../lib/logger";
import useAppStore from "../../../lib/store";
import usePersistStore from "../../../lib/store/persist";
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
import { HiOutlineCollection } from "react-icons/hi";
import {
  CreateCollectBroadcastItemResult,
  FreeCollectModuleSettings,
  Publication,
} from "../../../types";
import {
  LenstubeCollectModule,
  LenstubePublication,
} from "../../../types/local";
import { useAccount, useContractWrite, useSignTypedData } from "wagmi";
import styles from "../../../styles/buttontest.module.css";
import CollectModal from "./CollectModal";
import { useProfile } from "context/context";

type Props = {
  video: Publication;
  variant?: "primary" | "secondary";
};

const CollectButton: FC<Props> = ({ video, variant = "primary" }) => {
  const { profile } = useProfile();
  const { address } = useAccount();

  const [loading, setLoading] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [alreadyCollected, setAlreadyCollected] = useState(
    video?.hasCollectedByMe
  );
  const selectedChannelId = profile?.id;
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
  };

  const onCompleted = () => {
    setLoading(false);
    setAlreadyCollected(true);
    toast.success("Collected");
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError,
  });

  const { data, loading: fetchingCollectModule } = useQuery(
    VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY,
    {
      variables: { request: { publicationId: video?.id } },
    }
  );
  const collectModule: LenstubeCollectModule = data?.publication?.collectModule;

  const { write: writeCollectWithSig } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: "collectWithSig",
    mode: "recklesslyUnprepared",
    onError,
    onCompleted,
  });

  const [broadcast] = useMutation(BROADCAST_MUTATION, {
    onError,
    onCompleted,
  });

  const [createProxyActionFreeCollect] = useMutation(PROXY_ACTION_MUTATION, {
    onError,
    onCompleted,
  });

  const [createCollectTypedData] = useMutation(CREATE_COLLECT_TYPED_DATA, {
    async onCompleted(data) {
      const { typedData, id } =
        data.createCollectTypedData as CreateCollectBroadcastItemResult;
      try {
        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, "__typename"),
          types: omit(typedData?.types, "__typename"),
          value: omit(typedData?.value, "__typename"),
        });
        const { v, r, s } = utils.splitSignature(signature);
        const args = {
          collector: address,
          profileId: typedData?.value.profileId,
          pubId: typedData?.value.pubId,
          data: typedData.value.data,
          sig: { v, r, s, deadline: typedData.value.deadline },
        };
        setUserSigNonce(userSigNonce + 1);
        if (RELAYER_ENABLED) {
          const { data } = await broadcast({
            variables: { request: { id, signature } },
          });
          if (data?.broadcast?.reason)
            writeCollectWithSig?.({ recklesslySetUnpreparedArgs: args });
        } else {
          writeCollectWithSig?.({ recklesslySetUnpreparedArgs: args });
        }
      } catch (error) {
        setLoading(false);
        logger.error("[Error Collect Post]", error);
      }
    },
    onError,
  });

  const isFreeCollect =
    video?.collectModule.__typename === "FreeCollectModuleSettings";
  const handleCollect = (validate = true) => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    const collectModule = video?.collectModule as FreeCollectModuleSettings;
    if ((!isFreeCollect || collectModule.followerOnly) && validate) {
      return setShowCollectModal(true);
    }
    if (!validate) {
      toast("Collecting as NFT...");
      setShowCollectModal(false);
    }
    setLoading(true);
    if (isFreeCollect) {
      // Using proxyAction to free collect without signing
      createProxyActionFreeCollect({
        variables: {
          request: {
            collect: { freeCollect: { publicationId: video?.id } },
          },
        },
      });
    } else {
      createCollectTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: { publicationId: video?.id },
        },
      });
    }
  };
  const collectTooltipText = isFreeCollect ? (
    "Collect for free"
  ) : (
    <span>
      Collect for
      <b className="ml-1 space-x-1">
        <span>{collectModule?.amount?.value}</span>
        <span>{collectModule?.amount?.asset.symbol}</span>
      </b>
    </span>
  );

  return (
    <div>
      <Tooltip
        content={
          loading
            ? "Collecting"
            : alreadyCollected
            ? "Already Collected"
            : collectTooltipText
        }
        placement="top"
      >
        <div className={styles.body}>
          <Button
            borderRadius={"25px"}
            className={styles.ala}
            disabled={loading || alreadyCollected}
            onClick={() => handleCollect()}
            size="md"
            variant={variant}
          >
            {loading ? <div>loading</div> : <Text>Collect</Text>}
          </Button>
        </div>
      </Tooltip>
      {showCollectModal && (
        <CollectModal
          video={video}
          handleCollect={handleCollect}
          collecting={loading}
          collectModule={collectModule}
          fetchingCollectModule={fetchingCollectModule}
        />
      )}
    </div>
  );
};

export default CollectButton;
