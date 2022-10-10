import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import GET_PROFILES from "../graphql/profiles/get-profiles";
import { Maybe, Profile, Query, Scalars } from "../types/index";
import {
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  FC,
  ReactNode,
  useEffect,
} from "react";
import { previousDay } from "date-fns";

type Track = {
  title: string;
  artistName: string;
  audioSrc: string;
  image: string;
};

type ContextData = {
  tracks: Maybe<Track[]>;
  trackIndex: number;

  setTracks: Dispatch<SetStateAction<Track[]>>;
  setTrackIndex: Dispatch<SetStateAction<number>>;
};

const MusicContext = createContext<ContextData>(null);
MusicContext.displayName = "Music Context";

export const useMusicContext = (): ContextData => {
  return useContext(MusicContext);
};

export const MusicProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>();
  const [trackIndex, setTrackIndex] = useState<number>(0);

  return (
    <MusicContext.Provider
      value={{
        tracks,
        trackIndex,
        setTracks,

        setTrackIndex,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
