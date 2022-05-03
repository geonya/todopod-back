import { gql } from "apollo-server-express";

export default gql`
	type Client {
		id: Int!
		createdAt: String!
		updatedAt: String!
		project: [Project]
		name: String!
		phone: String
		email: String
		bizNumber: String
		sales: Int
		about: String
	}
`;
