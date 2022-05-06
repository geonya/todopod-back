import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		editDoc(id: Int!, file: Upload, caption: String): MutationResponse
	}
`;
