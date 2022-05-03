import { gql } from "apollo-server-express";

export default gql`
	type Doc {
		id: Int!
		createdAt: String!
		updatedAt: String!
		user: User!
		file: String!
		caption: String
		project: Project!
	}
`;
