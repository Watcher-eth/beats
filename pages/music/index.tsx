import { Circle, Flex, Spacer, Text, VStack, HStack } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { EXPLORE_AUDIO_PUBLICATIONS } from "graphql/explore/explore-publications";
import { normalizeUrl } from "lib/media";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCollectionQuery } from "@spinamp/spinamp-hooks";

function MusicPlayer() {
  const { data, loading, error } = useQuery(EXPLORE_AUDIO_PUBLICATIONS);
  const url = "https://arweave.net/XpvM3vUAbnphS76iF9HnkKF34lNH63mLq17Wp0OyrK4";
  const { collection, isLoading, isError, refetch } = useCollectionQuery(
    "0xA0125FDcb3e65A2cEaDF459B8d4454167eC51D7E"
  );

  const Waveform = dynamic(() => import("components/Music Player/Waveform"), {
    ssr: false,
  });

  if (loading)
    return (
      <VStack>
        <HStack>loading</HStack>
      </VStack>
    );

  if (error) return <div>Something went wrong</div>;
  console.log(data);
  return (
    <div>
      {collection.map((item, index) => {
        return (
          <motion.div key={index} whileHover={{ scale: 1.01 }}>
            <Flex

              m="5rem"
              w="400px"
              boxShadow={"xl"}
              h="120px"
              borderRadius={"15px"}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 3 }}
              >
                <Circle
                  minWidth={"100px"}
                  maxWidth={"100px"}
                  m="10px"
                  borderRadius={"50%"}
                >
                  <Image
                    width="100px"
                    height={"100px"}
                    layout={"intrinsic"}
                    style={{ borderRadius: "50%" }}
                    src={item?.lossyArtworkUrl}
                  />
                </Circle>
              </motion.div>
              <Flex direction={"column"} m="10px">
                <Text fontSize={"17px"} color={"gray.500"}>
                  {item?.artist?.name}
                </Text>
                <Waveform url={item?.lossyAudioUrl} width="10rem" height={40} />
              </Flex>
            </Flex>
          </motion.div>
        );
      })}
    </div>
  );
}

export default MusicPlayer;
