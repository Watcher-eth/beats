import { Box } from "@chakra-ui/react";
import React from "react";
import styles from "../../styles/backgroundBlur.module.css";

function backgroundBlur() {
  return (
    <Box>
      <div className={styles.container}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Box>
  );
}

export default backgroundBlur;
