import { gql } from "apollo-server-express";

export default gql`
	type Query {
		seeProject(id: Int!): Project
	}
`;
