import { gql } from "@apollo/client";
import { ProfileFields } from "../fragments";

export const CURRENT_USER_PROFILES_QUERY = gql`
  query userChannels($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFields
      }
    }
    userSigNonces {
      lensHubOnChainSigNonce
    }
  }
  ${ProfileFields}
`;
