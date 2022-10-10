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
} from "@chakra-ui/react";
import { useProfile } from "context/context";
import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
import { ethers, providers, utils } from "ethers";
import { WebBundlr } from "@bundlr-network/client";
import { motion } from "framer-motion";
import BigNumber from "bignumber.js";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { toastOn } from "lib/toasts";
import { normalizeUrl } from "../../lib/media";
import ReactAudioPlayer from "react-audio-player";
import { CREATOR_CATEGORIES } from "lib/creatorCategories";
import toast from "react-hot-toast";

import { ERROR_MESSAGE } from "../../lib/consts";
import { useRouter } from "next/router";
import { omit, trimIndentedSpaces } from "../../lib/utils";
import { FormEventHandler, useEffect } from "react";
import { AudioMimeTypes } from "../../types/metadata";
import { Metadata } from "../../types/metadata";
import { MetadataVersions, PublicationMainFocus } from "../../types/metadata";
import CollectModuleType from "components/Posts/CollectModule/CollectModuleType";
import useCreatePost from "../../hooks/lens/useCreatePost";
import { createPostTypedData } from "../../graphql/publications/create-post-typed-data";
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from "../../lib/store";
import { getCollectModule } from "../../lib/utils/getCollectModule";

import { v4 as uuidv4 } from "uuid";
import uploadToIPFS from "lib/ipfs";
const Waveform = dynamic(() => import("components/Music Player/Waveform"), {
  ssr: false,
});

function Index() {
  const router = useRouter();

  const { profile, isAuthenticated } = useProfile();

  useEffect(() => {
    if (isAuthenticated) return;

    router.push("/login?next=create");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const [bundlrInstance, setBundlrInstance] = useState<WebBundlr>();
  const [balance, setBalance] = useState<string>();
  const [ammount, setAmmount] = useState();
  const [image, setImage] = useState<string>();
  const [song, setSong] = useState<string>();
  const [file, setFile] = useState();
  const [songFile, setSongFile] = useState<string>();
  const [URI, setURI] = useState<string>();
  const [songURI, setSongURI] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const bundlrRef = useRef<WebBundlr>();
  const tags = [{ name: "Content-Type", value: "image/png" }];
  const tags2 = [{ name: "Content-Type", value: "audio/mpeg" }];
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

  async function initialize() {
    await window.ethereum.enable();
    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready();

    const bundlr = new WebBundlr(
      "https:/node1.bundlr.network",
      "matic",
      provider
    );
    await bundlr.ready();
    setBundlrInstance(bundlr);
    bundlrRef.current = bundlr;
    fetchBalance();
  }
  async function fetchBalance() {
    const balance = await bundlrRef.current.getLoadedBalance();
    console.log("Bal: ", utils.formatEther(balance.toString()));
    setBalance(utils.formatEther(balance.toString()));
  }

  async function fundWallet() {
    if (!ammount) return;
    const ammountParsed = parseInput(ammount);
    let response = await bundlrInstance.fund(ammountParsed);
    toast("Wallet funded with: ", response);
    fetchBalance();
  }

  function parseInput(input) {
    const conv = new BigNumber(input).multipliedBy(
      bundlrInstance.currencyConfig.base[1]
    );
    if (conv.isLessThan(1)) {
      console.log("error: value is too small");
      return;
    } else {
      return conv;
    }
  }

  async function uploadFiles() {
    if (file) {
      let tx = await bundlrInstance.uploader.upload(file, { tags: tags });
      console.log(tx.data.id);
      console.log(tx.data);
      setURI(`https://arweave.net/${tx?.data?.id}`);
    }
    if (songFile) {
      let tx2 = await bundlrInstance.createTransaction(songFile, {
        tags: [{ name: "Content-Type", value: audioType }],
      });
      await tx2.sign();
      await tx2.upload();
      console.log(tx2.id);
      console.log(tx2.data);
      setSongURI(`https://arweave.net/${tx2?.id}`);
    }
  }
  async function onFileChange(e) {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const image = URL.createObjectURL(file);
      setImage(image);
      let reader = new FileReader();
      reader.onload = function () {
        if (reader.result) {
          setFile(Buffer.from(reader.result));
        }
      };

      reader.readAsArrayBuffer(file);
      console.log(file);
    }
  }

  async function uploadIPFS(data) {
    const hash = await uploadToIPFS(data)
    setURL(hash)
    console.log(url)
  }

  async function onSongFileChange(e) {
    const songFile = e.target.files[0];
    setSongFile(songFile);
    setAudioType(songFile.type);
    if (songFile) {
      const song = URL.createObjectURL(songFile);
      setSong(song);

      let reader = new FileReader();
      reader.onload = function () {
        if (reader.result) {
          setSongFile(Buffer.from(reader.result));
        }
      };

      reader.readAsArrayBuffer(songFile);

      console.log(songFile);
    }
  }

  const metadata: Metadata = {
    name: title,
    locale: "en-US",
    metadata_id: uuidv4(),
    imageMimeType: "image/jpeg",
    version: MetadataVersions.two,
    image: URI,
    tags: [tag],
    content: trimIndentedSpaces(description),
    mainContentFocus: PublicationMainFocus.AUDIO,
    description: trimIndentedSpaces(description),
    attributes: [
      {
        traitType: "string",
        key: "type",
        value: "post",
      },
    ],
    media: [
      {
        item: songURI,
        type: audioType as AudioMimeTypes,
        cover: URI,
      },
    ],
  };

  async function onMetadataChange(metadata: Metadata) {
    if (metadata) {
      uploadIPFS(metadata)
    }
      
  }

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  //Create Post

  const uploadVideo: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if(!profile) return toast.error("Please sign in with your Lens Profile first.");
    if (!songURI)
      return toast.error("Please wait for the song to finish uploading.");
    if (!URI)
      return toast.error("Please wait for the cover to finish uploading.");

    if (url) {
      const waitForIndex = await createPost(url);

      await toastOn(waitForIndex, {
        loading: "Finishing upload...",
        success: "Song uploaded!",
        error: ERROR_MESSAGE,
      });
      toast.success("Uploaded Beat succesfully");

      router.push(`/profile/${profile.handle}`);
    }

    if (!url)
      return toast.error("Please wait for the metadata to finish uploading.");
  };

  function selectTag(tag, name) {
    toast(" ".concat("Selected: ", name));
    setTag(tag);
  }

  return (
    <Flex p="5rem 4rem">
      <VStack p="7rem 3rem 0rem 4rem" alignSelf={"center"}>
        <VStack spacing="25px" m="0 0 3rem  0">
          <VStack align={"flex-start"}>
            <HStack spacing={"25px"}></HStack>
            <Text fontSize={"40px"} color={"gray.800"}>
              Create Beat
            </Text>
            <Text fontSize={"20px"} color={"gray.800"}>
              All our Beats are stored on the Arweave Network. Arweave allows
              you to store your Beat's Metadata forever. Please fund your Wallet
              with Matic to upload your Beat.
            </Text>
          </VStack>
          <Divider orientation="horizontal" />
          <Flex direction={"column"}>
            {song ? (
              <VStack p="0 0 0 2rem">
                <Waveform url="https://arweave.net/XpvM3vUAbnphS76iF9HnkKF34lNH63mLq17Wp0OyrK4" />
              </VStack>
            ) : (
              <Tooltip
                label="Accepts .mp3, .wav, .ogg, .mpeg "
                placement="top"
                color={"white"}
                bg={"blackAlpha.500"}
                p="4px 8px"
                borderRadius={"14px"}
              >
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Dropzone
                    openRef={openRef}
                    onChange={onSongFileChange}
                    radius="md"
                    accept={[MIME_TYPES]}
                    sx={(theme) => ({
                      minHeight: 60,
                      minWidth: 250,
                      border: 0,
                      m: "1rem",
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[6]
                          : theme.colors.gray[0],

                      "&[data-accept]": {
                        color: theme.white,
                        backgroundColor: theme.colors.blue[6],
                      },

                      "&[data-reject]": {
                        color: theme.white,
                        backgroundColor: theme.colors.red[6],
                      },
                    })}
                  >
                    <div style={{ pointerEvents: "none" }}>
                      <Center>
                        <Text alignSelf="center" fontSize="lg" mt="xl">
                          Select Track
                          <Dropzone.Reject>
                            Pictures/GIFs less than 30mb
                          </Dropzone.Reject>
                        </Text>
                      </Center>
                    </div>
                  </Dropzone>
                </motion.div>
              </Tooltip>
            )}
            <Text fontSize="29px" m="0px 0 10px 0" color={"gray.700"}>
              Select Genre
            </Text>

            <SimpleGrid spacing={"20px"} m="0.3rem" columns={4}>
              {CREATOR_CATEGORIES.map((category) => {
                return (
                  <motion.div whileHover={{ scale: 1.04 }}>
                    <Box>
                      <Button
                        minWidth={"180px"}
                        h="60px"
                        bg="gray.800"
                        color={"white"}
                        onClick={() => selectTag(category.tag, category.name)}
                      >
                        {category.name}
                      </Button>
                    </Box>
                  </motion.div>
                );
              })}
            </SimpleGrid>
          </Flex>
          <Center>
            <CollectModuleType />
          </Center>

          {balance ? (
            <VStack alignSelf={"center"}>
              <Text fontSize={"20px"} m="0.2rem">
                Your Balance: {balance}
              </Text>

              <NumberInput
                m="0.5rem 0.2rem"
                defaultValue={0}
                min={0.1}
                max={20}
              >
                <NumberInputField
                  onChange={(e) => setAmmount(e.target.value)}
                  placeholder="Ammount to fund Upload"
                />
              </NumberInput>

              <Button onClick={fundWallet}> Fund Wallet</Button>
            </VStack>
          ) : (
            <Button
              w="200px"
              onClick={initialize}
              alignSelf="center"
              m="0.5rem"
              bg="gray.50"
              borderRadius={"35px"}
            >
              Sign in to Arweave
            </Button>
          )}
        </VStack>
      </VStack>
      <VStack
        w="auto%"
        h="100%"
        spacing="20px"
        m="3rem 8rem 6rem 3rem"
        boxShadow={"lg"}
        borderRadius="15px"
        p="30px 20px 5px 20px"
      >
        {" "}
        {image ? (
          <motion.div whileHover={{ scale: 1.025 }}>
            <Dropzone
              openRef={openRef}
              onChange={onFileChange}
              radius="md"
              accept={[
                MIME_TYPES.mp3,
                MIME_TYPES.wav,
                MIME_TYPES.ogg,
                MIME_TYPES.mpeg,
              ]}
              sx={(theme) => ({
                minHeight: 420,
                minWidth: 420,
                maxHeight: 420,
                maxWidth: 420,
                border: 0,
                boxShadow: "base",
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],

                "&[data-accept]": {
                  color: theme.white,
                  backgroundColor: theme.colors.blue[6],
                },

                "&[data-reject]": {
                  color: theme.white,
                  backgroundColor: theme.colors.red[6],
                },
              })}
            >
              <motion.div whileHover={{ scale: 1.01 }}>
                <Image
                  src={image}
                  borderRadius="12px"
                  boxShadow="base"
                  boxSize={"420px"}
                />
              </motion.div>
            </Dropzone>
          </motion.div>
        ) : (
          <Tooltip
            label="Accepts .jpeg, .png, .svg + animated .gif "
            placement="top"
            color={"white"}
            bg={"blackAlpha.500"}
            p="4px 8px"
            borderRadius={"14px"}
          >
            <motion.div whileHover={{ scale: 1.01 }}>
              <Dropzone
                openRef={openRef}
                onChange={onFileChange}
                radius="md"
                accept={[
                  MIME_TYPES.jpeg,
                  MIME_TYPES.png,
                  MIME_TYPES.gif,
                  MIME_TYPES.svg,
                ]}
                sx={(theme) => ({
                  minHeight: 420,
                  minWidth: 420,
                  maxHeight: 420,
                  maxWidth: 420,
                  border: 0,
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0],

                  "&[data-accept]": {
                    color: theme.white,
                    backgroundColor: theme.colors.blue[6],
                  },

                  "&[data-reject]": {
                    color: theme.white,
                    backgroundColor: theme.colors.red[6],
                  },
                })}
              >
                <div style={{ pointerEvents: "none" }}>
                  <Center>
                    <Text alignSelf="center" fontSize="xl" mt="xl">
                      Select Cover
                      <Dropzone.Reject>
                        Pictures/GIFs less than 30mb
                      </Dropzone.Reject>
                    </Text>
                  </Center>
                </div>
              </Dropzone>
            </motion.div>
          </Tooltip>
        )}
        <Flex direction={"column"}>
          <FormControl isRequired>
            <motion.div whileHover={{ scale: 1.01 }}>
              <Input
                m="0 0rem 0px 0rem"
                fontSize={"40px"}
                color="gray"
                variant={"ghost"}
                value={title}
                onChange={handleTitleChange}
                placeholder="Title"
                isRequired
              />
            </motion.div>
          </FormControl>
          <FormControl isRequired>
            <motion.div whileHover={{ scale: 1.01 }}>
              <Input
                fontSize={"25px"}
                m="0.5rem 0rem 0 0"
                color="gray.600"
                variant={"ghost"}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Description"
              />
            </motion.div>
          </FormControl>
        </Flex>
        <HStack
          margin={"10px 10px 10px 10px"}
          boxShadow="base"
          p="10px"
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
        <form onSubmit={uploadVideo}>
          {balance && (
            <HStack p="2rem 0 0 0">
              {songURI ? (
                <Box>
                  <Button
                    onClick={() => {
                      onMetadataChange(metadata);
                    }}
                  >
                    Upload Metadata
                  </Button>
                </Box>
              ) : (
                <Button
                  onClick={() => {
                    uploadFiles();
                  }}
                >
                  Upload to Arweave
                </Button>
              )}
            </HStack>
          )}
          <div>{url && <Button type="submit">Post</Button>}</div>
        </form>
      </VStack>
    </Flex>
  );
}

export default Index;
