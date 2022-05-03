import { gql } from "apollo-server-express";

export default gql`
	type ToDo {
		id: Int!
		createdAt: String!
		updatedAt: String!
		user: User!
		project: Project!
		hashtags: [Hashtag]
		work: String!
		deadline: String
		done: Boolean!
	}
`;
