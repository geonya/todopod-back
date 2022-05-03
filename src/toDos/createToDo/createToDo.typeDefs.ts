import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		createToDo(
			work: String!
			projectId: Int!
			deadline: String
		): MutationResponse!
	}
`;
