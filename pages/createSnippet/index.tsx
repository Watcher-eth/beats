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
  Textarea,
  Tooltip,
  Stack,
  Skeleton,
  SkeletonCircle,
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
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { useQuery } from "@apollo/client";
import { ERROR_MESSAGE } from "../../lib/consts";
import { useRouter } from "next/router";
import { omit, trimIndentedSpaces } from "../../lib/utils";
import { FormEventHandler, useEffect } from "react";
import { AudioMimeTypes } from "../../types/metadata";
import { Metadata } from "../../types/metadata";
import { MetadataVersions, PublicationMainFocus } from "../../types/metadata";
import CollectModuleType from "components/Posts/CollectModule/CollectModuleType";
import useCreatePost from "../../hooks/lens/useCreatePost";
import CarouselSelect from "../../components/common/CarouselSelect";
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from "../../lib/store";
import { getCollectModule } from "../../lib/utils/getCollectModule";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { v4 as uuidv4 } from "uuid";
import { useCollectionQuery } from "@spinamp/spinamp-hooks";
import FFmpeg from "../../components/Music Player/FFmpeg"
function index() {
  const router = useRouter();
  const waveform = useRef(null);
  const { profile, isAuthenticated } = useProfile();

  useEffect(() => {
    if (isAuthenticated) return;

    router.push("/login?next=createSnippet");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const [bundlrInstance, setBundlrInstance] = useState<WebBundlr>();
  const [balance, setBalance] = useState<string>();
  const [ammount, setAmmount] = useState();
  const [song, setSong] = useState<string>();
  const [songFile, setSongFile] = useState<string>();
  const [URI, setURI] = useState();
  const [songURI, setSongURI] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const bundlrRef = useRef<WebBundlr>();
  const tags2 = [{ name: "Content-Type", value: "audio/mpeg" }];
  const openRef = useRef<() => void>(null);
  const [audioType, setAudioType] = useState<string>();
  const [url, setURL] = useState();
  const uploadedVideo = useAppStore((state) => state.uploadedPost);
  const [tag, setTag] = useState<string>("");
  const [regions, setRegions] = useState();
  const [ready, setReady] = useState(false);
  const { createPost } = useCreatePost();
  useEffect(() => {
    if (isAuthenticated) return;

    router.push("/login?next=createSnippet");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Initialize Waveform
  useEffect(() => {
    // Check if wavesurfer object is already created.
    if (!waveform.current && song) {
      const initProgress = async () => {
        try {
          const RegionsPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.regions.min.js");

          const waveSurfer = (await import("wavesurfer.js")).default;
          waveform.current = waveSurfer.create({
            container: "#waveform",
            waveColor: "#gray",
            barGap: 2,
            barWidth: 3,
            barRadius: 4,
            cursorWidth: 3,
            cursorColor: "#gray",
            height: 65,
            plugins: [
              RegionsPlugin.create({
                regionsMinLength: 10,
                regionsMaxLength: 60,
              }),
            ],
          });

          if (!waveform.current.regions.list[0]) {
            waveform.current.enableDragSelection({
              maxLength: 90,
            });
            // Perform action when new region is created
            waveform.current.on("region-created", (e) => {
              e.color = "gray, 0.7";
              e.playLoop;
              setRegions([e]);
              console.log(regions);
              console.log(e);
            });
          }

          waveform.current.load(song);
        } catch (error) {
          console.error(error);
        }
      };

      initProgress();
    }

    if (waveform.current && song) {
      const initProgress = async () => {
        try {
          const RegionsPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.regions.min.js");
          waveform.current.destroy();
          const waveSurfer = (await import("wavesurfer.js")).default;
          waveform.current = waveSurfer.create({
            container: "#waveform",
            waveColor: "#gray",
            barGap: 2,
            barWidth: 3,
            barRadius: 4,
            cursorWidth: 3,
            cursorColor: "#gray",
            height: 65,
            plugins: [
              RegionsPlugin.create({
                regionsMinLength: 1,
                regionsMaxLength: 5,
              }),
            ],
          });
          waveform.current.enableDragSelection({
            maxLength: 60,
          });
          // Perform action when new region is created
          waveform.current.on("region-created", (e) => {
            e.color = "gray, 0.7";

            setRegions([e]);
          });
          // Perform action when new region is created
          waveform.current.on("region-updated", function (region) {
            var Regions = region.wavesurfer.regions.list;
            var keys = Object.keys(Regions);
            if (keys.length > 1) {
              Regions[keys[0]].remove();
            }
          });

          waveform.current.load(song);
        } catch (error) {
          console.error(error);
        }
      };
      initProgress();
    }
  }, [song]);


  const cutAudio = async (region) => {

    if (region) {
      const endIndex = region.end;
      const startIndex = region.start;
      ffmpeg.FS("writeFile", "snippet.mp3", await fetchFile(song));
      ffmpeg.run(
        `-i snippet.mp3 -ss ${startIndex} -to ${endIndex} -c copy cutSnippet.mp3`
      );
      const data = ffmpeg.FS("readFile", "cutSnippet.mp3");
      const snippetUrl = URL.createObjectURL(new Blob([data.buffer]));
      setSongFile(snippetUrl);
      console.log(songFile);
    }
  };
 
  const id = profile?.id;

  const { address, isDisconnected } = useAccount();

  const { collection, isLoading, isError, refetch } = useCollectionQuery(
    "0xA0125FDcb3e65A2cEaDF459B8d4454167eC51D7E"
  );

  if (isLoading) {
    return <p>Loading!</p>;
  }

  if (isError) {
    return (
      <div>
        <p>Ups! Something went wrong</p>
        <button onClick={() => refetch()}>Try again</button>
      </div>
    );
  }
  if (collection) console.log(collection);

  //Audio Controls

  const playRegion = (id) => {
    waveform.current.regions.list[id].playLoop();
  };

  const playAudio = () => {
    // Check if the audio is already playing
    if (waveform.current.isPlaying()) {
      waveform.current.pause();
    } else {
      waveform.current.play();
    }
  };

  //Initialize Bundlr
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
  //Upload Files
  async function uploadFiles() {
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
  //Upload Metadata
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
      const payload = JSON.stringify(metadata);
      console.log(metadata);
      let tx = await bundlrInstance.createTransaction(payload, {
        tags: [{ name: "Content-Type", value: "application/json" }],
      });
      await tx.sign();
      await tx.upload();

      console.log(tx.id);
      console.log(getCollectModule(uploadedVideo.collectModule));
      setURL(`https://arweave.net/${tx.id}`);
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
        success: "Video uploaded!",
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
    <Flex direction={"column"} p="1rem 4rem" w="100%" overflow="hidden">
      <VStack p="5rem 3rem 0rem 4rem" alignSelf={"center"}>
        <VStack spacing="15px" m="1 0 3rem  0">
          <VStack align={"flex-start"}>
            <HStack spacing={"25px"}></HStack>
            <Text fontSize={"40px"} color={"gray.800"}>
              Create Snippet
            </Text>
            <Text fontSize={"20px"} color={"gray.800"}>
              Choose a short clip from your favourite beat and share it with
              your friends and the world. Snippets need to be less than 60sec.
            </Text>
          </VStack>
          <Divider orientation="horizontal" w="100%" />

          <FormControl isRequired>
            <motion.div whileHover={{ scale: 1.01 }}>
              <Center>
                <Textarea
                  w="80%"
                  fontSize={"25px"}
                  m="0.2rem 0rem 0 0"
                  color="gray.600"
                  variant={"outline"}
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Description"
                  alignSelf={"start"}
                  isRequired
                />
              </Center>
            </motion.div>
          </FormControl>
      
          <FFmpeg/>
          {song ? (
            <VStack p="0 0 0 2rem">
              <Flex flexDirection="row" w="100%">
                <Box id="waveform" w="40rem" />
                <Flex justifyContent="center">
                  <Text color="gray.600"></Text>
                  <Button
                    m="4"
                    onClick={playAudio}
                    p="20px"
                    borderRadius={"25px"}
                  >
                    Play Song
                  </Button>
                </Flex>
                {regions?.map((region, index) => {
                  return (
                    <HStack key={index}>
                      <Button onClick={() => playRegion(region.id)}>
                        Play Snippet
                      </Button>
                    </HStack>
                  );
                })}
              </Flex>
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
                    minWidth: 500,
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
          <Text color={"gray.600"} alignSelf={"center"} m="15px">
            or
          </Text>
          <Text color={"gray.800"} alignSelf={"start"} fontSize="20px">
            Your Collection
          </Text>
          <Center overflow="hidden" w="1200px">
            <CarouselSelect id={collection} setSong={setSong} />
          </Center>
        </VStack>
      </VStack>
      <Spacer />
      <VStack>
        {balance ? (
          <VStack alignSelf={"center"}>
            <Text fontSize={"20px"} m="0.2rem">
              Your Balance: {balance}
            </Text>

            <NumberInput m="0.5rem 0.2rem" defaultValue={0} min={0.1} max={20}>
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

        <Center>
          <CollectModuleType />
        </Center>
      </VStack>
    </Flex>
  );
}

export default index;
