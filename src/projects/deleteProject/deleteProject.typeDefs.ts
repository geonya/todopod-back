import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		deleteProject(id: Int!): MutationResponse!
	}
`;
