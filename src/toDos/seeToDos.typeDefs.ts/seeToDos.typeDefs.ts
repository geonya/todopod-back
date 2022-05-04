import { gql } from "apollo-server-express";

export default gql`
	type Query {
		seeToDos(userId: Int, projectId: Int): [ToDo]
	}
`;
