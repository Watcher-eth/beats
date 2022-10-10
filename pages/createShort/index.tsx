import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Image,
  HStack,
  Flex,
  FormControl,
  Avatar,
  NumberInput,
  NumberInputField,
  Spacer,
  Divider,
  Center,
  SimpleGrid,
  Tooltip,
  Textarea,
} from "@chakra-ui/react";
import { useProfile } from "context/context";
import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
import { ethers, providers, utils } from "ethers";
import { WebBundlr } from "@bundlr-network/client";
import { motion } from "framer-motion";
import BigNumber from "bignumber.js";

import { toastOn } from "lib/toasts";
import { normalizeUrl } from "../../lib/media";

import { CREATOR_CATEGORIES } from "lib/creatorCategories";
import toast from "react-hot-toast";

import { ERROR_MESSAGE } from "../../lib/consts";
import { useRouter } from "next/router";
import { omit, trimIndentedSpaces } from "../../lib/utils";
import { FormEventHandler, useEffect } from "react";

import { Metadata } from "../../types/metadata";
import { MetadataVersions, PublicationMainFocus } from "../../types/metadata";
import CollectModuleType from "components/Posts/CollectModule/CollectModuleType";
import useCreatePost from "../../hooks/lens/useCreatePost";
import { createPostTypedData } from "../../graphql/publications/create-post-typed-data";
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from "../../lib/store";
import { getCollectModule } from "../../lib/utils/getCollectModule";
import uploadToIpfs from "../../lib/ipfs"
import { v4 as uuidv4 } from "uuid";
const Waveform = dynamic(() => import("components/Music Player/Waveform"), {
  ssr: false,
});

function index() {
  const router = useRouter();

  const { profile, isAuthenticated } = useProfile();

  useEffect(() => {
    if (isAuthenticated) return;

    router.push("/login?next=createShort");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  
 
 
  const [URI, setURI] = useState<string>();

  
  const [description, setDescription] = useState<string>();

  const openRef = useRef<() => void>(null);
  const [audioType, setAudioType] = useState<string>();
  const [url, setURL] = useState<string>();
  const uploadedVideo = useAppStore((state) => state.uploadedPost);
  const [tag, setTag] = useState<string>("");
  const { createPost } = useCreatePost();

  useEffect(() => {
    if (isAuthenticated) return;

    router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

 

 

  async function uploadFiles(data) {
    const hash = await uploadToIpfs(data)
    setURI(hash)
    console.log(URI)
  }
  



  const metadata: Metadata = {
    name: trimIndentedSpaces(description),
    locale: "en-US",
    metadata_id: uuidv4(),
    version: MetadataVersions.two,
    content: trimIndentedSpaces(description),
    mainContentFocus: PublicationMainFocus.TEXT_ONLY,
    description: trimIndentedSpaces(description),
    attributes: [
      {
        traitType: "string",
        key: "type",
        value: "post",
      },
    ],
  };

  async function onMetadataChange(metadata: Metadata) {
    if (metadata) {
      
      uploadFiles(metadata)
    }
  }

 
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  //Create Post

  const uploadVideo  = async () => {
  
    if(!profile) return toast.error("Please sign in with your Lens Profile first.");
    if (!URI)
      return toast.error("Please wait for the cover to finish uploading.");

    if (URI) {
      const waitForIndex = await createPost(URI);
      await toastOn(waitForIndex, {
        loading: "Finishing upload...",
        success: "Message uploaded!",
        error: ERROR_MESSAGE,
      });
      toast.success("Uploaded Beat succesfully");

      router.push(`/profile/${profile.handle}`);
    }

   
  };

  function selectTag(tag, name) {
    toast(" ".concat("Selected: ", name));
    setTag(tag);
  }

  return (
    <VStack marginTop={["4.5rem", "4.5rem" ,"4.5rem", "6rem"]}>
      <VStack
        w={["400px","500px","750px","900px"]}
        h="100%"
        spacing="15px"
        m={[ "0.5rem","1rem","2rem 2rem 2rem 2rem","3rem 8rem 3rem 3rem"]}
        boxShadow={"lg"}
        borderRadius="15px"
        p="30px 20px 5px 20px"
      >
      
     
          
          <FormControl isRequired>
            <motion.div whileHover={{ scale: 1.01 }}>
            <Textarea
                  isRequired
                  fontSize={"25px"}
                  m="8px 0rem 0px 0rem"
                  color="gray.600"
                  variant={"outline"}
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="What's happening?"
                  alignSelf={"start"}
                />
            </motion.div>
          </FormControl>
 <HStack spacing={["2px","5vw","19vw","24vw"]}>
        <HStack
          margin={"5px 10px 0 10px"}
          boxShadow="base"
          p="8px"
          borderRadius="15px"
          bg={"gray.50"}
        >
          <Avatar
            name={profile?.handle}
            src={normalizeUrl(profile?.picture?.original?.url)}
            size="sm"
            marginRight={"7px"}
          />
          <Text fontSize="lg" color="black" as="b">
            {profile?.handle}
          </Text>
          <Spacer />
        </HStack>
  
     
        <CollectModuleType />
       </HStack>
       <VStack p="0rem 0rem 0rem 0rem" alignSelf={"center"}>
        
      </VStack>
       
            <HStack p="0 0 1rem 0">
              {URI ? (
                <Box>
                  <Button
                    onClick={() => {
                      uploadVideo()
                    }}
                  >
                    Post to Beats
                  </Button>
                </Box>
              ) : (
                <Button
                  onClick={() => {
                    onMetadataChange(metadata);
                  }}
                >
                  Upload Metadata
                </Button>
              )}
            </HStack>
          
      
      </VStack>
      </VStack>
  );
}

export default index;
