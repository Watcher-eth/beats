import logger from "../../lib/logger";
import { WebBundlr } from "@bundlr-network/client";
import { FetchSignerResult } from "@wagmi/core";
import { Profile } from "../../types";
import {
  BUNDLR_CURRENCY,
  BUNDLR_NODE_URL,
  POLYGON_RPC_URL,
  WMATIC_TOKEN_ADDRESS,
} from "../constants";
import create from "zustand";
import {
  BundlrDataState,
  LenstubePublication,
  UploadedPost,
} from "../../types/local";

export const UPLOADED_VIDEO_FORM_DEFAULTS = {
  stream: null,
  preview: "",
  audioType: "",
  file: null,
  title: "",
  description: "",
  thumbnail: "",
  thumbnailType: "",
  audioSource: "",
  percent: 0,
  playbackId: "",
  isSensitiveContent: false,
  isUploadToIpfs: false,
  loading: false,
  buttonText: "Upload Video",
  durationInSeconds: null,

  collectModule: {
    type: "freeCollectModule",
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: "" },
    referralFee: 0,
    isTimedFeeCollect: false,
    isFreeCollect: true,
    isFeeCollect: false,
    isRevertCollect: false,
  },
  disableComments: false,
  isNSFW: false,
  isNSFWThumbnail: false,
};

export const UPLOADED_VIDEO_BUNDLR_DEFAULTS = {
  balance: "0",
  estimatedPrice: "0",
  deposit: null,
  instance: null,
  depositing: false,
  showDeposit: false,
};

interface AppState {
  profiles: Profile[] | [];
  recommendedChannels: Profile[] | [];
  showCreateProfile: boolean;
  hasNewNotification: boolean;
  userSigNonce: number;
  selectedProfile: Profile | null;
  watchTime: number;
  setWatchTime: (WatchTime: number) => void;
  setSelectedProfile: (profile: Profile | null) => void;
  setUserSigNonce: (userSigNonce: number) => void;
  setShowCreateProfile: (showCreateProfile: boolean) => void;
  setProfiles: (profiles: Profile[]) => void;
  setRecommendedChannels: (profiles: Profile[]) => void;
  setHasNewNotification: (value: boolean) => void;
  setUploadedPost: (post: { [k: string]: any }) => void;

  uploadedPost: UploadedPost;
  bundlrData: BundlrDataState;
}

export const useAppStore = create<AppState>((set) => ({
  profiles: [],
  recommendedChannels: [],
  showCreateProfile: false,
  hasNewNotification: false,
  userSigNonce: 0,
  uploadedPost: UPLOADED_VIDEO_FORM_DEFAULTS,
  bundlrData: UPLOADED_VIDEO_BUNDLR_DEFAULTS,
  selectedProfile: null,
  watchTime: 0,
  setBundlrData: (bundlrData) =>
    set((state) => ({ bundlrData: { ...state.bundlrData, ...bundlrData } })),
  setUploadedPost: (postData) =>
    set((state) => ({
      uploadedPost: { ...state.uploadedPost, ...postData },
    })),
  setWatchTime: (watchTime) => set(() => ({ watchTime })),
  setSelectedProfile: (profile) => set(() => ({ selectedProfile: profile })),
  setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce })),
  setHasNewNotification: (b) => set(() => ({ hasNewNotification: b })),
  setProfiles: (profiles) => set(() => ({ profiles })),
  setRecommendedChannels: (recommendedChannels) =>
    set(() => ({ recommendedChannels })),
  setShowCreateProfile: (showCreateProfile) =>
    set(() => ({ showCreateProfile })),
  getBundlrInstance: async (signer) => {
    try {
      const bundlr = new WebBundlr(
        BUNDLR_NODE_URL,
        BUNDLR_CURRENCY,
        signer?.provider,
        {
          providerUrl: POLYGON_RPC_URL,
        }
      );
      await bundlr.utils.getBundlerAddress(BUNDLR_CURRENCY);
      await bundlr.ready();
      return bundlr;
    } catch (error) {
      logger.error("[Error Init Bundlr]", error);
      return null;
    }
  },
}));

export default useAppStore;
