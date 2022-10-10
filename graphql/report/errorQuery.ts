import { gql } from "@apollo/client";

const PublicationMetadataStatus = gql`
  query PublicationMetadataStatus {
    publicationMetadataStatus(
      request: {
        txHash: "0x5ee16171d9b7b4f45f97212d46b6a0f2ff77c1047dbcdc37d1065ca8a514359a"
      }
    ) {
      status
      reason
    }
  }
`;

export default
