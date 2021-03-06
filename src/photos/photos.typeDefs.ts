import { gql } from "apollo-server-express";

export default gql`
	type Photo {
		id: Int!
		createdAt: String!
		updatedAt: String!
		user: User!
		project: Project!
		file: String!
		caption: String
		hashtags: [Hashtag]
	}
`;
