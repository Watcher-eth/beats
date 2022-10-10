import { Box, Center, Flex, HStack, Input, Text, Textarea, Tooltip, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import CollectModuleType from "../../components/Posts/CollectModule/CollectModuleType";
import styles from "../../styles/backgroundBlur.module.css";
import {motion} from "framer-motion"
import { useCollectionQuery } from "@spinamp/spinamp-hooks";
import MusicPlayer from "../../components/Music Player/MusicPlayer";
import { useMusicContext } from "context/MusicContext";
import {fetchTrackByIdOrSlug, fetchPlaylistById, IPlaylist, ITrack} from '@spinamp/spinamp-sdk';
import Image from "next/image";
import useDebounce from "hooks/useDebounce";
import SearchList from "./searchList";
import CarouselSelect from "components/common/CarouselSelect";
import SelectCollection from "./SelectCollection";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useProfile } from "context/context";
import { useRouter } from "next/router";
import uploadToIPFS from "lib/ipfs";
function CreatePlaylist() {
  const router = useRouter();
  const { profile, isAuthenticated } = useProfile();
const [notices, setNotices] = useState<ITrack[]>()
const [search, setSearch] = useState<string | null >(null)
const [loading, setLoading] = useState(false)
const [selectedIds, setSelectedIds] = useState([])
const debouncedSearch= useDebounce(search, 500)
const [image, setImage] = useState<string>();
const [file, setFile] = useState();
const openRef = useRef<() => void>(null);
const [title, setTitle] = useState<string>();
const [description, setDescription] = useState<string>();
const [url, setURL] = useState<string>();
useEffect(() => {

  
  if (isAuthenticated) return;

  router.push("/login?next=createPlaylist");
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAuthenticated]);

useEffect(() =>{
  setLoading(true)
  async function setData(){



  await fetchTrackByIdOrSlug(debouncedSearch).then((tracks: ITrack[] ) => {
   
    setNotices(tracks)

    setLoading(false)
  })}
if(debouncedSearch)
  setData()
}, [debouncedSearch])
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



  return (
    <VStack m="2rem">
      <Text fontSize={"35px"}>Create a Playlist</Text>
      <Flex p="2.5rem">

      <Tooltip
                label="Accepts .mp3, .wav, .ogg, .mpeg "
                placement="top"
                color={"white"}
                bg={"blackAlpha.500"}
                p="4px 8px"
                borderRadius={"14px"}
              >
                <motion.div whileHover={{ scale: 1.02 }}>
                 {image ? <Dropzone
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
                minHeight: 180,
                minWidth: 180,
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
                  style={{       borderRadius:"12px"}}
           
                  height=" 170"
              width= "170"
                />
              </motion.div>
            </Dropzone> : <Dropzone
                    openRef={openRef}
                   onChange={onFileChange}
                    radius="md"
                    accept={[MIME_TYPES]}
                    sx={(theme) => ({
                      minHeight: 180,
                      minWidth: 180,
                      border: 0,
                      m: "0.1rem",
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
                 
                  </Dropzone>}
                </motion.div>
              </Tooltip>
        <VStack spacing={"20px"} p="1rem" >
      <Input w="20vw" type={"text"} p="0.5rem" placeholder="Title" onChange={(e) => setTitle(e.target.value)}/>
      <Textarea w="20vw" p="0.5rem"  placeholder="Description" onChange={(e) => setDescription(e.target.value)}/>
      </VStack>
      </Flex>
      <Tooltip
                label="Double click songs to add to your selection "
                placement="top"
                color={"white"}
                bg={"blackAlpha.500"}
                p="4px 8px"
                borderRadius={"14px"}>
      <Input w="40vw" m="3rem" type={"search"} placeholder="Search for Song" onChange={(e) => setSearch(e.target.value)}/></Tooltip>
     <Box w={["50vw"]}>
    {notices && <SearchList tracks={notices}/>}
    </Box>
   
     </VStack>
  );
}

export default CreatePlaylist;
