import { gql } from "apollo-server-express";

export default gql`
	type Query {
		searchProjects(keyword: String!): [Project]
	}
`;
