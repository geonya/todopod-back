import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		editPhoto(id: Int!, file: Upload, caption: String): MutationResponse!
	}
`;
