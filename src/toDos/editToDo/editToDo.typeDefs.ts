import { gql } from "apollo-server-express";

export default gql`
	type Mutation {
		editToDo(id: Int!, work: String!): MutationResponse
	}
`;
