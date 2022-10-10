import { Box, Center } from "@chakra-ui/react";
import React from "react";
import CollectModuleType from "../../components/Posts/CollectModule/CollectModuleType";
import styles from "../../styles/backgroundBlur.module.css";
function collect() {
  return (
    <Box p={"8rem"}>
      <Box p={"8rem"} h="10rem" className={styles.body}>
        <Box className={styles.container}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Box>
      </Box>
    </Box>
  );
}

export default collect;
