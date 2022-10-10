import { gql } from "@apollo/client";

const GET_FOLLOWERS = gql`
  query ($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        wallet {
          address
          defaultProfile {
            id
            name
            bio
            handle
            followNftAddress
            metadata
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
                  url
                  mimeType
                }
              }
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
                contractAddress
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
        }
        totalAmountOfTimesFollowed
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

export default GET_FOLLOWERS;
