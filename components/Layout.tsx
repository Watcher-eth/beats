import Link from "next/link";
import useAppStore from "../lib/store";
import usePersistStore from "../lib/store/persist";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import LensAvatar from "./LensAvatar";
import { classNames } from "../lib/utils";
import { SearchIcon } from "@chakra-ui/icons";
import { Toaster } from "react-hot-toast";
import ConnectWallet from "./ConnectWallet";
import { FC, Fragment, ReactNode } from "react";
import { APP_NAME, IS_MAINNET } from "../lib/consts";
import { Menu, Transition } from "@headlessui/react";
import { useProfile } from "../context/context";
import {
  Center,
  Text,
  Box,
  Stack,
  HStack,
  VStack,
  IconButton,
  Avatar,
  Flex,
  Spacer,
  Divider,
  Button,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { Profile } from "../types";
import { useQuery } from "@apollo/client";
import { CURRENT_USER_PROFILES_QUERY } from "../graphql/auth/currentUser";
import Notifications from "./notifications/Notification";
import CreateModal from "./common/CreateModal";
import AudioPlayer from "./Music Player/AudioPlayer"
interface Props {
  children: ReactNode;
}

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, isAuthenticated } = useProfile();
  console.log(profile);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setSelectedProfile = useAppStore((state) => state.setSelectedProfile);
  const selectedProfile = useAppStore((state) => state.selectedProfile);
  const selectedProfileId = usePersistStore((state) => state.selectedProfileId);
  const setSelectedProfileId = usePersistStore(
    (state) => state.setSelectedProfileId
  );
  const { address, isDisconnected } = useAccount();
  const { pathname, replace, asPath } = useRouter();

  const setUserChannels = (profiles: Profile[]) => {
    setProfiles(profiles);
    const selectedChannel = profiles.find(
      (prof) => profile.id === selectedProfileId
    );
    setSelectedProfile(selectedProfile ?? profiles[0]);
    setSelectedProfileId(selectedProfile?.id);
  };

  const { loading } = useQuery(CURRENT_USER_PROFILES_QUERY, {
    variables: {
      request: { ownedBy: address },
    },
    skip: !selectedProfileId,
    onCompleted: (data) => {
      const profiles: Profile[] = data?.profiles?.items;

      setUserChannels(profiles);
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce);
    },
  });

  return (
    <Flex margin="0.5rem" w="100%" direction={"column"}>
      <Toaster position="top-center" />
      <HStack
        h="60px"
        w="98%"
        spacing="20px"
        backdropBlur={"15px"}
        position="absolute"
        m="1rem"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center justify-center"
        >
          <Link
            href="/"
            className="text-red-400 tracking-tighter flex items-center space-x-2"
          >
            <Text m="1rem" fontSize={"30px"} color={"whiteAlpha.600"}>
              {APP_NAME}
            </Text>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link href={"/explore"}>
            <Button
                    colorScheme="whiteAlpha"
              borderRadius={"20px"}

              variant="ghost"
            >
              Explore
            </Button>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link href={"/playlists"}>
            <Button
              colorScheme="whiteAlpha"
              borderRadius={"20px"}
            
              variant="ghost"
            >
              Playlists
            </Button>
          </Link>
        </motion.div>

        <Spacer />
        <Notifications />
        <CreateModal />
        <ConnectWallet>
          {({ logout }) => (
            <Menu as="div" className="mr-1 relative flex diretion-crow">
              <Menu.Button className="max-w-xs bg-white flex diretion-crow items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <Center>
                  <LensAvatar profile={profile} width={10} height={10} />
                </Center>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                  <Menu.Item>
                    {({ active }) => (
                      <Button
                        onClick={logout}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "hover:bg-gray-100 block w-full text-left px-4 py-2 text-sm text-gray-700 transition"
                        )}
                        margin="0.5rem"
                      >
                        Log out
                      </Button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </ConnectWallet>
      </HStack>
      <Flex direction={"row"}>
        <Box w="100%" className="flex-1 flex flex-col">
          {children}
        </Box>
      </Flex>
      <AudioPlayer/>
    </Flex>
  );
};

export default Layout;
