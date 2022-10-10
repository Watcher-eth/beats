import { Profile } from "../../types";

import create from "zustand";
import { persist } from "zustand/middleware";

interface AppPerisistState {
  isAuthenticated: boolean;
  isSignedUser: boolean;
  autoPlay: boolean;
  selectedProfileId: string | null;
  selectedProfile: Profile | null;
  notificationCount: number;
  setSelectedProfileId: (id: string | null) => void;
  setNotificationCount: (count: number) => void;
  setSelectedProfile: (profile: Profile | null) => void;
  setAutoPlay: (auto: boolean) => void;
  setIsAuthenticated: (auth: boolean) => void;
  setIsSignedUser: (auth: boolean) => void;
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set, get) => ({
      isAuthenticated: false,
      isSignedUser: false,

      selectedProfileId: null,
      autoPlay: true,
      selectedProfile: null,
      notificationCount: 0,
      setAutoPlay: (autoPlay) => set(() => ({ autoPlay })),
      setNotificationCount: (notificationCount) =>
        set(() => ({ notificationCount })),
      setSelectedProfileId: (id) => set(() => ({ selectedProfileId: id })),
      setSelectedProfile: (profile) =>
        set(() => ({ selectedProfile: profile })),

      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
      setIsSignedUser: (isSignedUser) => set(() => ({ isSignedUser })),
    }),
    {
      name: "echo.store",
    }
  )
);

export default usePersistStore;
