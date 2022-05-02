import { gql } from "apollo-server-express";

export default gql`
	type User {
		id: Int!
		username: String!
		email: String!
		password: String!
		createdAt: String!
		updatedAt: String!
		avatar: String
	}
`;
