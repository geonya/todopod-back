import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		editProject(
			id: Int!
			title: String
			description: String
			clientName: String
			deadline: String
		): MutationResponse!
	}
`;
