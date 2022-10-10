import { Flex, Textarea, VStack } from '@chakra-ui/react';
import { useProfile } from 'context/context';
import useCreateComment from 'hooks/lens/useCreateComment';
import { ERROR_MESSAGE } from 'lib/consts';
import uploadToIPFS from 'lib/ipfs';
import useAppStore from 'lib/store';
import { toastOn } from 'lib/toasts';
import { trimIndentedSpaces } from 'lib/utils';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { Metadata, MetadataVersions, PublicationMainFocus } from 'types/metadata';
import { v4 as uuidv4 } from "uuid";
function CommentField(props) {
    const router = useRouter();

    const { profile, isAuthenticated } = useProfile();
  
   
    const [URI, setURI] = useState<string>();
    const [comment, setComment] = useState<string>();
    const [url, setURL] = useState<string>();
    const uploadedVideo = useAppStore((state) => state.uploadedPost);
    
    const { createComment } = useCreateComment(props?.id);
  
    
   
  
   
  
    async function uploadFiles(data) {
      const hash = await uploadToIPFS(data)
      setURI(hash)
      console.log(URI)
    }
    
  
  
  
    const metadata: Metadata = {
      name: trimIndentedSpaces(comment),
      locale: "en-US",
      metadata_id: uuidv4(),
      version: MetadataVersions.two,
      content: trimIndentedSpaces(comment),
      mainContentFocus: PublicationMainFocus.TEXT_ONLY,
      description: trimIndentedSpaces(comment),
      attributes: [
        {
          traitType: "string",
          key: "type",
          value: "comment",
        },
      ],
    };
  
    async function onMetadataChange(metadata: Metadata) {
      if (metadata) {
        
        uploadFiles(metadata)
      }
    }
  
   
    const handleDescriptionChange = (e) => setComment(e.target.value);
  
    //Create Post
  
    const uploadComment  = async () => {
    
      if(!profile) return toast.error("Please sign in with your Lens Profile first.");
      if (!URI)
        return toast.error("Please wait for the cover to finish uploading.");
  
      if (URI) {
        const waitForIndex = await createComment(URI);
        await toastOn(waitForIndex, {
            loading: "Finishing upload...",
            success: "Video uploaded!",
            error: ERROR_MESSAGE,
          });
        toast.success("Uploaded Beat succesfully");
  
        router.push(`/profile/${profile.handle}`);
      }
  
     
    };

  
   
  return (
    <VStack p="1rem"><Textarea    
    fontSize={"25px"}
    m="8px 0rem 0px 0rem"
    color="gray.600"
    variant={"outline"}
    value={comment}
    onChange={handleDescriptionChange}
    placeholder="Write a comment..."
    alignSelf={"center"}></Textarea></VStack>
  )
}

export default CommentField