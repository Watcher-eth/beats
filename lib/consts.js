import { chain } from "wagmi";

export const APP_ID = "Echo";
export const APP_NAME = "Echo";
export const ERROR_MESSAGE = "Something went wrong! Please try again";

export const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK == "mainnet";
export const CHAIN = chain.polygon;
export const RELAYER_HOSTS = [
  "http://localhost:3000",
  "https://lumiere.withlens.app",
];
export const RELAYER_ON = RELAYER_HOSTS.includes(process.env.NEXT_PUBLIC_URL);

export const API_URL = "https://api.lens.dev";

export const LENSHUB_PROXY = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export const LENS_PERIPHERY = IS_MAINNET
  ? "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f"
  : "0xD5037d72877808cdE7F669563e9389930AF404E8";
