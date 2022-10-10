import Wavesurfer from "wavesurfer.js";
import { useEffect, useRef } from "react";
import { Flex, Button, Box, Text } from "@chakra-ui/react";

const Waveform = ({ url, width, height }) => {
  const waveform = useRef(null);

  useEffect(() => {
    // Check if wavesurfer object is already created.
    if (!waveform.current) {
      // Create a wavesurfer object
      // More info about options here https://wavesurfer-js.org/docs/options.html
      waveform.current = Wavesurfer.create({
        container: "#waveform",
        waveColor: "#gray",
        barGap: 2,
        barWidth: 3,
        barRadius: 4,
        cursorWidth: 3,
        cursorColor: "#gray",
        height: height,

        splitChannels: false,
      });
      // Load audio from a remote url.
      waveform.current.load(url);
      /* Duration*/
    }
  }, [url]);

  const playAudio = () => {
    // Check if the audio is already playing
    if (waveform.current.isPlaying()) {
      waveform.current.pause();
    } else {
      waveform.current.play();
    }
  };

  return (
    <Flex flexDirection="row" w="100%">
      <Box id="waveform" w={width} />
      <Flex justifyContent="center">
        <Text color="gray.600"></Text>
        <Button m="4" onClick={playAudio} p="20px" borderRadius={"25px"}>
          Play
        </Button>
      </Flex>
    </Flex>
  );
};

export default Waveform;
