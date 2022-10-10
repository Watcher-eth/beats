import { Box, Button, Text } from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { providers, utils } from "ethers";
import { WebBundlr } from "@bundlr-network/client";
import { fetchBalance } from "@wagmi/core";
import { BundlrContext } from "../../context/bundlrContex";

function index() {
  const [bundlrInstance, setBundlrInstance] = useState();
  const [balance, setBalance] = useState();
  const bundlrRef = useRef();
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
  return (
    <Box p="8rem">
      <BundlrContext.Provider
        value={(initialize, fetchBalance, balance, bundlrInstance)}
      >
        {balance && (
          <Box>
            <Text>Your Balance: {balance}</Text>
          </Box>
        )}
        <Button onClick={initialize}>Intialize</Button>
      </BundlrContext.Provider>
    </Box>
  );
}

export default index;
