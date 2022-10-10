import { getSigner } from "../utils";
import { LENS_HUB_ABI } from "../abis/LensHubProxy.json";
import { ethers } from "ethers";
// lens contract info can all be found on the de
import { useContract, useSigner } from "wagmi";

// contract address on polygon.
// not defining here as it will bloat the code example
const LENS_HUB_CONTRACT_ADDRESS = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";
export function Lens_Hub() {
  const { data: signer, isError, isLoading } = useSigner();
  const lensHub = useContract(LENS_HUB_CONTRACT_ADDRESS, LENS_HUB_ABI, signer);
}
