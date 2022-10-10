import toast from "react-hot-toast";
import { toastOn } from "../../lib/toasts";
import { ERROR_MESSAGE } from "../../lib/consts";
import useFollowing from "../../hooks/lens/useFollowing";
import { FC, useCallback, useMemo, useState } from "react";
import useFollowProfile from "../../hooks/lens/useFollowProfile";
import { FollowModuleRedeemParams, Profile } from "../../types/index";
import { Button } from "@chakra-ui/react";
import SubscribeActions from "./FunctionalComponents/FollowButton";
import { motion } from "framer-motion";
const FollowButton: FC<{ profile: Profile }> = ({ profile }) => {
  const [tempFollowing, setTempFollowing] = useState<boolean>(false);
  const { data: isFollowing, refetch } = useFollowing(profile?.id);
  const { followProfile } = useFollowProfile({
    onSuccess: () => setTempFollowing(true),
    onIndex: refetch,
  });
  const followModule = useMemo<FollowModuleRedeemParams>(() => {
    if (!profile?.followModule) return;

    if (profile?.followModule?.__typename == "FeeFollowModuleSettings") {
      return {
        feeFollowModule: {
          amount: {
            currency: profile?.followModule?.amount?.asset?.address,
            value: profile?.followModule?.amount?.value,
          },
        },
      };
    }

    if (profile?.followModule?.__typename == "ProfileFollowModuleSettings") {
      return {
        profileFollowModule: {
          profileId: profile?.id,
        },
      };
    }
  }, [profile?.followModule, profile?.id]);

  const follow = useCallback(async () => {
    const waitForIndex = await followProfile(profile?.id, followModule);

    await toastOn(waitForIndex, {
      loading: "Processing subscription...",
      success: "Subscribed to channel!",
      error: ERROR_MESSAGE,
    });
  }, [profile?.id, followModule, followProfile]);

  const unfollowProfile = () => {
    toast.error("Not implemented yet");
  };

  if (isFollowing || tempFollowing) {
    return (
      <motion.div whileHover={{ scale: 1.07 }}>
        <Button
          bg="white"
          h="40px"
          w="100px"
          borderRadius={"35px"}
          color="black"
          boxShadow={"base"}
          onClick={unfollowProfile}
        >
          Following
        </Button>
      </motion.div>
    );
  }

  if (profile?.followModule?.__typename == "RevertFollowModuleSettings") {
    return (
      <motion.div whileHover={{ scale: 1.07 }}>
        <Button
          h="40px"
          w="100px "
          borderRadius={"35px"}
          onClick={() =>
            toast.error("This profile isn't accepting new followers right now")
          }
        >
          Private
        </Button>
      </motion.div>
    );
  }

  if (profile?.followModule?.__typename == "FeeFollowModuleSettings") {
    console.log(profile.name);
    return (
      <motion.div whileHover={{ scale: 1.05 }}>
        <Button
          onClick={follow}
          h="40px"
          w="130px "
          borderRadius={"35px"}
          colorScheme="twitter"
        >
          {profile.followModule.amount.value} $
          {profile.followModule.amount.asset.symbol}
        </Button>
      </motion.div>
    );
  }

  return <SubscribeActions channel={profile} id={profile?.id} />;
};

export default FollowButton;
