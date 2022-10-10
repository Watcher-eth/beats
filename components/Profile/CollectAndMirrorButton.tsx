import { Button, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { FreeCollectModuleSettings } from "types";
import useCollectPublication from "../../hooks/lens/useCollectPublication";
import useMirrorPublication from "../../hooks/lens/useMirrorPublication";
import { AiOutlineRetweet } from "react-icons/ai";
import { motion } from "framer-motion";
function CollectAndMirrorButton(props) {
  const {
    data: hasMirrored,
    mirrorPublication,
    loading: mirrorLoading,
  } = useMirrorPublication(props.id);
  const {
    data: hasCollected,
    collectPublication,
    loading: collectLoading,
  } = useCollectPublication(props.id);
  const collectModule = props.collectModule as FreeCollectModuleSettings;
  return (
    <HStack spacing={"10px"} p=" 0 0 5px 0">
      <HStack spacing={"1px"} >

  
      <motion.div whileHover={{ scale: 1.1 }}>
        <IconButton
          variant={"ghost"}
          m="0 "
          aria-label="Mirror"
          onClick={() =>
            mirrorPublication(props.id, {
              followerOnlyReferenceModule:
                props.referenceModule == "FollowOnlyReferenceModuleSettings",
            })
          }
          disabled={hasMirrored}
        
          icon={<AiOutlineRetweet size={"20px"} />}
        ></IconButton>
      </motion.div>
      {props.mirror && <Text>{props.mirror}</Text>}
      </HStack>
      <motion.div whileHover={{ scale: 1.1 }}>
        <Button
          disabled={hasCollected}
          colorScheme={props?.colorScheme}
          color={props?.color}
          onClick={() => collectPublication(props.id)}
          borderRadius="25px"
          h="40px"
        >
          Collect
        </Button>
      </motion.div>
    </HStack>
  );
}

export default CollectAndMirrorButton;
