import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

const APIURL = "https://api.lens.dev";

export const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

export const ADD_REACTION = gql`
  mutation ($request: ReactionRequest!) {
    addReaction(request: $request)
  }
`;

export const GET_PROFILE = gql`
  query Profile($id: ProfileId!) {
    profile(request: { profileId: $id }) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      isFollowedByMe
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
        }
        ... on RevertFollowModuleSettings {
          type
        }
        fragment
        CollectModuleFields
        on
        CollectModule {
          __typename
          ... on FreeCollectModuleSettings {
            type
          }
          ... on FeeCollectModuleSettings {
            type
            amount {
              asset {
                ...Erc20Fields
              }
              value
            }
            recipient
            referralFee
          }
          ... on LimitedFeeCollectModuleSettings {
            type
            collectLimit
            amount {
              asset {
                ...Erc20Fields
              }
              value
            }
            recipient
            referralFee
          }
          ... on LimitedTimedFeeCollectModuleSettings {
            type
            collectLimit
            amount {
              asset {
                ...Erc20Fields
              }
              value
            }
            recipient
            referralFee
            endTimestamp
          }
          ... on RevertCollectModuleSettings {
            type
          }
          ... on TimedFeeCollectModuleSettings {
            type
            amount {
              asset {
                ...Erc20Fields
              }
              value
            }
            recipient
            referralFee
            endTimestamp
          }
        }
      }
    }
  }
`;

export const getPublications = gql`
  query Publications($id: ProfileId!, $limit: LimitScalar) {
    publications(
      request: {
        profileId: $id
        publicationTypes: [POST]
        limit: $limit
        metadata: { mainContentFocus: [IMAGE, AUDIO] }
      }
    ) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
      }
    }
  }
  fragment PostFields on Post {
    id
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    stats {
      ...PublicationStatsFields
    }
    referenceModule {
      ...ReferenceModuleFields
    }
  
  }
  fragment PublicationStatsFields on PublicationStats { 
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment ReferenceModuleFields on ReferenceModule {
    ... on FollowOnlyReferenceModuleSettings {
      type
      contractAddress
    }
    ... on UnknownReferenceModuleSettings {
      type
      contractAddress
      referenceModuleReturnData
    }
    ... on DegreesOfSeparationReferenceModuleSettings {
      type
      contractAddress
      commentsRestricted
      mirrorsRestricted
      degreesOfSeparation
    }
  }
  

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    tags
    cover {
      original {
        url
      }
    }
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }
  fragment MediaFields on Media {
    url
    mimeType
  }
`;

export const recommendProfiles = `
  query RecommendedProfiles {
    recommendedProfiles {
        id
        name
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        handle
        stats {
          totalFollowers
        }
    }
  }
`;

export const getCollectedPublications = gql`
  query Publications($id: ProfileId!, $limit: LimitScalar) {
    publications(
      request: {
        profileId: $id
        publicationTypes: [POST]
        limit: $limit
        metadata: { mainContentFocus: [AUDIO] }
      }
    ) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
      }
    }
  }
  fragment PostFields on Post {
    id
    metadata {
      ...MetadataOutputFields
    }
    createdAt
  }
  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    tags
    cover {
      original {
        url
      }
    }
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }
  fragment MediaFields on Media {
    url
    mimeType
  }
`;

export const recommendedProfiles = `
  query RecommendedProfiles {
    recommendedProfiles {
        id
        name
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        handle
        stats {
          totalFollowers
        }
    }
  }
`;

export const searchProfiles = `
  query Search($query: Search!, $type: SearchRequestTypes!) {
    search(request: {
      query: $query,
      type: $type,
      limit: 10
    }) {
      ... on ProfileSearchResult {
        __typename 
        items {
          ... on Profile {
            ...ProfileFields
          }
        }
        pageInfo {
          prev
          totalCount
          next
        }
      }
    }
  }
  fragment MediaFields on Media {
    url
  }
  fragment ProfileFields on Profile {
    profileId: id,
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    stats {
      totalFollowers
      totalFollowing
    }
  }`;

export const GET_PUBLICATION = gql`
  query ($request: InternalPublicationId!) {
    publication(request: { publicationId: $id }) {
      __typename
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Mirror {
        ...MirrorFields
      }
    }
  }

  fragment MediaFields on Media {
    url
    mimeType
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    isFollowedByMe
    isFollowing(who: null)
    followNftAddress
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
        type
      }
      ... on RevertFollowModuleSettings {
        type
      }
    }
  }

  fragment PublicationStatsFields on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on FreeCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    hidden
    reaction(request: null)
    mirrors(by: null)
    hasCollectedByMe
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    hidden
    reaction(request: null)
    hasCollectedByMe
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
    hidden
    reaction(request: null)
    mirrors(by: null)
    hasCollectedByMe
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentMirrorOfFields
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
      }
    }
  }
`;
