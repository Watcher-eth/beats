import { gql } from '@apollo/client'

const GET_PUBLICATION_COMMENTS = gql`
	query($request: WhoCollectedPublicationRequest!) {
    whoCollectedPublication(request: $request) {
       items {
        address
        defaultProfile {
          id
          name
          bio
          isDefault
          attributes {
            displayType
            traitType
            key
            value
          }
          followNftAddress
          metadata
          handle
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              chainId
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
              chainId
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
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

`

export default GET_PUBLICATION_COMMENTS
