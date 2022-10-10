import Image from "next/image";
import { FC, useMemo } from "react";
import { Profile } from "../types/index";
import Skeleton from "react-loading-skeleton";
import { normalizeUrl, resolveImageUrl } from "../lib/media";
import { Avatar, Center } from "@chakra-ui/react";

const LensAvatar: FC<{
  profile: Profile;
  width: number;
  height: number;
  className?: string;
  srcOverride?: string;
}> = ({ profile, width, height, srcOverride, className = "" }) => {
  const avatarUrl = useMemo<string | null>(() => {
    if (!profile) return;
    if (srcOverride !== undefined) return normalizeUrl(srcOverride);
    if (!profile?.picture)
      return `https://avatar.tobi.sh/${profile.handle}.png`;

    return resolveImageUrl(profile.picture);
  }, [profile, srcOverride]);

  return (
    <div>
      {avatarUrl ? (
        <Avatar
          h={{
            sm: height * 0.4,
            md: height * 0.5,
            lg: height * 0.7,
            xl: height * 1,
          }}
          w={{
            sm: width * 0.4,
            md: width * 0.5,
            lg: width * 0.7,
            xl: width * 1,
          }}
          src={avatarUrl}
          border="1px white blackAlpha"
        ></Avatar>
      ) : (
        <Skeleton circle width={width} height={height} />
      )}
    </div>
  );
};

export default LensAvatar;
