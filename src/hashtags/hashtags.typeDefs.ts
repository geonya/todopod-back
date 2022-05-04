import { gql } from "apollo-server-express";

export default gql`
	type Hashtag {
		id: Int!
		createdAt: String!
		updatedAt: String!
		hashtag: String!
		projects: [Project]
		toDos: [ToDo]
		photos: [Photo]
		projectsCount: Int!
		toDosCount: Int!
		photosCount: Int!
	}
`;
