import { getSigner } from "../utils";
import LENS_HUB_ABI from "../abis/LensProxy";
import { ethers } from "ethers";
// lens contract info can all be found on the deployed
// contract address on polygon.
// not defining here as it will bloat the code example

// lens contract info can all be found on the de
import { useContract, useSigner } from "wagmi";

// contract address on polygon.
// not defining here as it will bloat the code example

export const useSignedTypeData = (domain, types, value) => {
  const { data: signer, isError, isLoading } = useSigner();
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omitDeep(domain, "__typename"),
    omitDeep(types, "__typename"),
    omitDeep(value, "__typename")
  );
};

export const splitSignature = (signature) => {
  return utils.splitSignature(signature);
};
