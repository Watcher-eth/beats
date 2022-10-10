import React from 'react'

function Feed() {
  return (
 <AspectRatio minW="300px" ratio={6} zIndex={-1}>
    <Image
      objectFit={"cover"}
      src={normalizeUrl(profile?.coverPicture?.original?.url)}
      position="relative"
    />
  </AspectRatio>

  <Flex w="100%">
    <VStack spacing="14px" margin={"3rem 0 0 3rem"} justify="start">
      <Avatar
        w={{ base: "150px", md: "150px", sm: "120px" }}
        h={{ base: "150px", md: "150px", sm: "120px" }}
        src={normalizeUrl(profile?.picture?.original?.url)}
        position="relative"
      />

      <VStack spacing="1px">
        <Text fontSize={"2xl"}>{profile?.name}</Text>

        <Text fontSize={"md"} color="darkGray">
          {profile?.handle}
        </Text>
      </VStack>
      <HStack spacing="5px">
        <HStack spacing="15px">
          <VStack>
            <Text fontSize="30px">{profile?.stats?.totalFollowers}</Text>
            <Text fontSize="md">Followers</Text>
          </VStack>
          <VStack>
            <Text fontSize="30px">{profile?.stats?.totalFollowing}</Text>
            <Text fontSize="md">Following</Text>
          </VStack>
        </HStack>
      </HStack>
      <Divider orientation="horizontal" />

      <FollowedBy />
      <HStack>
        {(() => {
          const website = profile?.attributes?.find(
            (attr) => attr.key == "website"
          );
          if (!website) return;

          return (
            <a
              href={website.value}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2"
            >
              <Button className="sr-only" borderRadius="15px">
                Personal Website
              </Button>
            </a>
          );
        })()}
        {(() => {
          const twitter = profile?.attributes?.find(
            (attr) => attr.key == "twitter"
          );
          if (!twitter) return;

          return (
            <a
              href={`https://twitter.com/${twitter.value}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2"
            >
              {" "}
              <Button
                colorScheme={"twitter"}
                borderRadius="15px"
                className="sr-only"
              >
                Twitter
              </Button>
            </a>
          );
        })()}
      </HStack>

      <Text fontSize="xl" as="b" alignSelf={"start"}>
        Bio
      </Text>

      <Divider orientation="horizontal" />

      <Text
        color={"gray.600"}
        alignSelf={"start"}
        noOfLines={[1, 2, 3]}
        maxWidth="300px"
      >
        {profile?.bio}
      </Text>
    </VStack>
    <VStack margin={"2rem"}>
      <HStack spacing="2rem " w="100%">
        <Tabs isFitted colorScheme={"blackAlpha"}>
          <TabList>
            <Tab>Posts</Tab>
            <Tab>Collectibles</Tab>
            <Tab>Verefiable Credentials</Tab>
          </TabList>
          <TabPanels p="2rem">
            <TabPanel>
              <CreatedFeed
                name={profile?.handle}
                src={profile?.picture?.original?.url}
              />
            </TabPanel>
            <TabPanel>
              <CollectiblesFeed
                address={profile?.ownedBy}
                name={profile?.handle}
                src={profile?.picture?.original?.url}
              />
            </TabPanel>
            <TabPanel>Red, yellow and blue.</TabPanel>
          </TabPanels>
        </Tabs>
      </HStack>
    </VStack>
  </Flex>
  )
}

export default Feed