import { useQuery } from "@apollo/client";

import AddressExplorerLink from "../../Links/HashExplorerLink";
import {
  Box,
  useDisclosure,
  Button,
  HStack,
  Toast,
  VStack,
  Text,
  Modal,
  ModalContent,
} from "@chakra-ui/react";

import {
  ALLOWANCE_SETTINGS_QUERY,
  PUBLICATION_REVENUE_QUERY,
} from "../../../graphql/LEnstube";
import useAppStore from "../../../lib/store";
import usePersistStore from "../../../lib/store/persist";
import { shortenAddress } from "../../../lib/utils";
import { useProfile } from "context/context";
import dayjs from "dayjs";
import React, { Dispatch, FC, useEffect, useState } from "react";
import {
  LenstubeCollectModule,
  LenstubePublication,
} from "../../../types/local";
import { useBalance } from "wagmi";
import { Publication } from "types";

type Props = {
  showModal: boolean;
  setShowModal: Dispatch<boolean>;
  video: Publication;
  // eslint-disable-next-line no-unused-vars
  handleCollect: (validate: boolean) => void;
  collecting: boolean;
  fetchingCollectModule: boolean;
  collectModule: LenstubeCollectModule;
};

const CollectModal: FC<Props> = ({
  video,
  handleCollect,
  collecting,
  collectModule,
  fetchingCollectModule,
}) => {
  const { profile } = useProfile();
  const selectedChannel = profile;
  const selectedChannelId = profile.id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAllowed, setIsAllowed] = useState(true);
  const [haveEnoughBalance, setHaveEnoughBalance] = useState(false);
  const isMembershipActive =
    video?.profile?.followModule?.__typename === "FeeFollowModuleSettings";

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    addressOrName: selectedChannel?.ownedBy,
    token: collectModule?.amount?.asset?.address,
    formatUnits: collectModule?.amount?.asset?.decimals,
    watch: !!collectModule?.amount,
    enabled: !!collectModule?.amount,
  });

  const { data: revenueData } = useQuery(PUBLICATION_REVENUE_QUERY, {
    variables: {
      request: {
        publicationId: video?.id,
      },
    },
    skip: !video?.id,
  });

  const {
    loading: allowanceLoading,
    data: allowanceData,
    refetch: refetchAllowance,
  } = useQuery(ALLOWANCE_SETTINGS_QUERY, {
    variables: {
      request: {
        currencies: collectModule?.amount?.asset?.address,
        followModules: [],
        collectModules: collectModule?.type,
        referenceModules: [],
      },
    },
    skip: !collectModule?.amount?.asset?.address || !selectedChannelId,
    onCompleted(data) {
      setIsAllowed(
        data?.approvedModuleAllowanceAmount[0]?.allowance !== "0x00"
      );
    },
  });

  useEffect(() => {
    if (
      balanceData &&
      collectModule?.amount &&
      parseFloat(balanceData?.formatted) <
        parseFloat(collectModule?.amount?.value)
    )
      setHaveEnoughBalance(false);
    else setHaveEnoughBalance(true);
    if (collectModule) {
      refetchAllowance();
    }
  }, [
    balanceData,
    collectModule,
    collectModule?.amount?.value,
    collectModule?.amount,
    refetchAllowance,
  ]);

  return (
    <Box>
      <Button onClick={onOpen}>open</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <Box className="mt-4">
            <Button
              onClick={onClose}
              alignSelf="flex-end"
              bg="black"
              color="white"
            >
              Close
            </Button>
            {!fetchingCollectModule && !allowanceLoading ? (
              <>
                {collectModule?.amount ? (
                  <Box className="flex flex-col mb-3">
                    <Text className="text-sm">Price</Text>
                    <Box className="space-x-1">
                      <Text className="text-2xl font-semibold">
                        {collectModule?.amount?.value}
                      </Text>
                      <Text>{collectModule?.amount?.asset.symbol}</Text>
                    </Box>
                  </Box>
                ) : null}
                <VStack className="flex flex-col mb-3">
                  <Text className="text-sm">Total Collects</Text>
                  <Box className="space-x-1">
                    <Text>{video?.stats.totalAmountOfCollects}</Text>
                  </Box>
                </VStack>
                {collectModule?.recipient ? (
                  <VStack className="flex flex-col mb-3">
                    <Text className="mb-0.5 text-sm">Recipient</Text>
                    <AddressExplorerLink hash={collectModule?.recipient}>
                      <Text className="text-lg">
                        {shortenAddress(collectModule?.recipient)}
                      </Text>
                    </AddressExplorerLink>
                  </VStack>
                ) : null}
                {revenueData?.publicationRevenue ? (
                  <VStack className="flex flex-col mb-3">
                    <Text className="text-xs">Revenue</Text>
                    <Box className="space-x-1">
                      <Text className="text-2xl font-semibold">
                        {revenueData?.publicationRevenue?.revenue?.total
                          ?.value ?? 0}
                      </Text>
                      <Text>{collectModule?.amount?.asset.symbol}</Text>
                    </Box>
                  </VStack>
                ) : null}
                {collectModule?.endTimestamp ? (
                  <VStack className="flex flex-col mb-3">
                    <Text className="mb-0.5 text-sm">Collect until</Text>
                    <Text className="text-lg">
                      {dayjs(collectModule.endTimestamp).format(
                        "MMMM DD, YYYY"
                      )}{" "}
                      at {dayjs(collectModule.endTimestamp).format("hh:mm a")}
                    </Text>
                  </VStack>
                ) : null}
                {collectModule?.referralFee ? (
                  <VStack className="flex flex-col mb-3">
                    <Text className="mb-0.5 text-sm">Referral Fee</Text>
                    <Text className="text-lg">
                      {collectModule.referralFee} %
                    </Text>
                  </VStack>
                ) : null}
                <HStack className="flex justify-end">
                  {isAllowed ? (
                    collectModule?.followerOnly &&
                    !video.profile.isFollowedByMe ? (
                      <Box className="flex-1">
                        <Toast>
                          {" "}
                          <Text className="flex px-2">
                            Only{" "}
                            {isMembershipActive ? "Members" : "Subscribers"} can
                            collect this publication
                          </Text>
                        </Toast>
                      </Box>
                    ) : balanceLoading && !haveEnoughBalance ? (
                      <Text className="flex justify-center w-full py-2">
                        Loading
                      </Text>
                    ) : haveEnoughBalance ? (
                      <HStack>
                        <Button
                          disabled={collecting}
                          onClick={() => handleCollect(false)}
                          alignItems="center"
                        >
                          Collect Now
                        </Button>
                      </HStack>
                    ) : (
                      <Box></Box>
                    )
                  ) : (
                    <Box></Box>
                  )}
                </HStack>
              </>
            ) : (
              <Text className="py-6">Loading</Text>
            )}
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CollectModal;
