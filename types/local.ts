import { WebBundlr } from "@bundlr-network/client";

import {
  Attribute,
  Comment,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  Mirror,
  Post,
  RevertCollectModuleSettings,
  TimedFeeCollectModuleSettings,
} from ".";

export type PostDraft = {
  preview: string;
  title: string;
  description: string;
};
export type BundlrDataState = {
  instance: WebBundlr | null;
  balance: string;
  estimatedPrice: string;
  deposit: string | null;
  depositing: boolean;
  showDeposit: boolean;
};

export type FileReaderStreamType = NodeJS.ReadableStream & {
  name: string;
  size: number;
  type: string;
  lastModified: string;
};

export type UploadedPost = {
  stream: FileReaderStreamType | null;
  preview: string;
  audioType: string;
  file: File | null;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailType: string;
  playbackId: string;
  percent: number;
  isSensitiveContent: boolean;
  isUploadToIpfs: boolean;
  loading: boolean;
  audioSource: string;
  buttonText: string;
  durationInSeconds: string | null;
  collectModule: CollectModuleType;
  disableComments: boolean;
  isNSFW: boolean;
  isNSFWThumbnail: boolean;
};

export type CollectModuleType = {
  isTimedFeeCollect?: boolean;
  isFreeCollect?: boolean;
  isFeeCollect?: boolean;
  isRevertCollect?: boolean;
  isLimitedFeeCollect?: boolean;
  isLimitedTimeFeeCollect?: boolean;
  amount?: { currency?: string; value: string };
  referralFee?: number;
  collectLimit?: string;
  followerOnlyCollect?: boolean;
  recipient?: string;
};

export type LenstubePublication = Post & Comment & Mirror & { hls: HLSData };

export type IPFSUploadResult = {
  url: string;
  type: string;
};

export type HLSData = {
  hrn: string;
  url: string;
  type: string;
};

export type PostUploadForm = {
  postThumbnail: IPFSUploadResult | null;
  postSource: string | null;
  playbackId: string | null;
  title: string;
  description: string;
  adultContent: boolean;
};

export type StreamData = {
  streamKey: string;
  hostUrl: string;
  playbackId: string;
  streamId: string;
};

export type ProfileMetadata = {
  version: string;
  metadata_id: string;
  name: string | null;
  bio: string | null;
  cover_picture: string | null;
  attributes: Attribute[];
};

export type LenstubeCollectModule = FreeCollectModuleSettings &
  FeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings;
