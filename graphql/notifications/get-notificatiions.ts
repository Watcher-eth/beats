import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = `
  mutation($request: NotificationRequest!) { 
    items {
      ... on NewFollowerNotification {
        ...NewFollowerNotificationFields
      }

      ... on NewMirrorNotification {
        ...NewMirrorNotificationFields
      }

      ... on NewCollectNotification {
        ...NewCollectNotificationFields
      }

      ... on NewCommentNotification {
        ...NewCommentNotificationFields
      }

      ... on NewMentionNotification {
        mentionPublication {
           ... on Post {
              ...CompactPost
            }
            ... on Comment {
              ...CompactComment
            }
        }
        createdAt
      }
    }
    pageInfo {
      ...CommonPaginatedResultInfo
    }
  }
 }
 
 fragment CommentWithCommentedPublicationFields on Comment {
  ...CompactComment
  commentOn {
    ... on Post {
      ...CompactPost
    }
    ... on Mirror {
      ...CompactMirror
    }
    ... on Comment {
      ...CompactComment
    }
  }
}

fragment NewFollowerNotificationFields on NewFollowerNotification {
  __typename
  createdAt
  isFollowedByMe
  wallet {
    ...Wallet
  }
}

fragment NewCollectNotificationFields on NewCollectNotification {
  __typename
  createdAt
  wallet {
    ...Wallet
  }
  collectedPublication {
    __typename
    ... on Post {
      ...CompactPost
    }

    ... on Mirror {
      ...CompactMirror
    }

    ... on Comment {
      ...CompactComment
    }
  }
}

fragment NewMirrorNotificationFields on NewMirrorNotification {
  __typename
  createdAt
  profile {
    ...CompactProfile
  }
  publication {
    ... on Post {
      ...CompactPost
    }
    ... on Comment {
      ...CompactComment
    }
  }
}

fragment NewCommentNotificationFields on NewCommentNotification {
  __typename
  createdAt
  profile {
    ...CompactProfile
  }
  comment {
    ...CommentWithCommentedPublicationFields
  }
}

fragment CompactProfile on Profile {
  id
  name
  handle
  picture {
    ...ProfileMediaFields
  }
}
fragment CompactPublicationStats on PublicationStats {
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
}

fragment CompactMetadata on MetadataOutput {
  name
  description
  content
  media {
    ...ProfileMediaFields
  }
}

fragment CompactPost on Post {
  id
  stats {
    ...CompactPublicationStats
  }
  metadata {
    ...CompactMetadata
  }
  profile {
    ...CompactProfile
  }
  collectedBy {
    ...Wallet
  }
  createdAt
}

fragment CompactMirror on Mirror {
  id
  stats {
    ...CompactPublicationStats
  }
  metadata {
    ...CompactMetadata
  }
  profile {
    ...CompactProfile
  }
  createdAt
}

fragment CompactComment on Comment {
  id
  stats {
    ...CompactPublicationStats
  }
  metadata {
    ...CompactMetadata
  }
  profile {
    ...CompactProfile
  }
  collectedBy {
    ...Wallet
  }
  createdAt
}

fragment CommonPaginatedResultInfo on PaginatedResultInfo {
  prev
  next
  totalCount
}

fragment MediaFields on Media {
  url
  width
  height
  mimeType
}

fragment ProfileMediaFields on ProfileMedia {
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

    small {
      ...MediaFields
    }

    medium {
      ...MediaFields
    }
  }
}

fragment Wallet on Wallet {
  address
  defaultProfile {
    ...CompactProfile
  }
  totalAmountOfProfiles
}
`;
