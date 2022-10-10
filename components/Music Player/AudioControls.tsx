import { Button, HStack } from "@chakra-ui/react";
import styles from "../../styles/MusicPlayer.module.css";
import React from "react";

const AudioControls = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
}) => (
  <HStack className={styles.audio_controls}>
    <Button
      type="button"
      className={styles.prev}
      aria-label="Previous"
      onClick={onPrevClick}
    >
      Prev
    </Button>
    {isPlaying ? (
      <Button
        type="button"
        className={styles.pause}
        onClick={() => onPlayPauseClick(false)}
        aria-label="Pause"
        width="35px"
        height="35px"
      >
        Pause
      </Button>
    ) : (
      <Button
        type="button"
        className={styles.play}
        onClick={() => onPlayPauseClick(true)}
        aria-label="Play"
      >
        Play
      </Button>
    )}
    <Button
      type="button"
      className="next"
      aria-label="Next"
      onClick={onNextClick}
      width="35px"
      height="35px"
    >
      Next
    </Button>
  </HStack>
);

export default AudioControls;
