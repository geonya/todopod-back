import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		uploadDoc(file: Upload!, caption: String, projectId: Int!): Doc
	}
`;
