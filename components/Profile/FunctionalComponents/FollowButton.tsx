import Subscribe from "./subscribe";
import UnSubscribe from "./UnSubscribe";
import React, { FC, useEffect, useState } from "react";
import { Profile } from "../../../types";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "../../../graphql/queries";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
type Props = {
  channel: Profile;
  id: any;
};

const SubscribeActions: FC<Props> = ({ channel, id }) => {
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: { id },
  });
  const isSubscriber = data?.profile?.isFollowedByMe;
  useEffect(() => {
    setSubscriber(isSubscriber);
    console.log(isSubscriber);
  }, [channel?.isFollowedByMe]);
  const [subscriber, setSubscriber] = useState(isSubscriber);

  return data?.profile.isFollowedByMe === true ? (
    <motion.div whileHover={{ scale: 1.07 }}>
      <UnSubscribe
        channel={channel}
        onUnSubscribe={() => setSubscriber(false)}
      />
      {data?.profile.isFollowedByMe}
    </motion.div>
  ) : (
    <motion.div whileHover={{ scale: 1.07 }}>
      <Subscribe channel={channel} onSubscribe={() => setSubscriber(true)} />
      {data?.profile.isFollowedByMe}
    </motion.div>
  );
};

export default SubscribeActions;
