import { gql } from "apollo-server-express";

export default gql`
	type Project {
		id: Int!
		createdAt: String!
		updatedAt: String!
		user: User!
		title: String!
		description: String
		client: Client
		toDos: [ToDo]
		hashtags: [Hashtag]
		deadline: String
		docs: [Doc]
	}
`;
