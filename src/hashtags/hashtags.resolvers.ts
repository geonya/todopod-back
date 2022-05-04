import { Resolvers } from "../types";

// - [ ] adjust pagination
const resolvers: Resolvers = {
	Hashtag: {
		projects: ({ id }, _: any, { prisma }) =>
			prisma.project.findMany({ where: { hashtags: { some: { id } } } }),
		projectsCount: ({ id }, _: any, { prisma }) =>
			prisma.project.count({ where: { hashtags: { some: { id } } } }),
		toDos: ({ id }, _: any, { prisma }) =>
			prisma.toDo.findMany({ where: { hashtags: { some: { id } } } }),
		toDosCount: ({ id }, _: any, { prisma }) =>
			prisma.toDo.count({ where: { hashtags: { some: { id } } } }),
		photos: ({ id }, _: any, { prisma }) =>
			prisma.photo.findMany({ where: { hashtags: { some: { id } } } }),
		photosCount: ({ id }, _: any, { prisma }) =>
			prisma.photo.count({ where: { hashtags: { some: { id } } } }),
	},
};

export default resolvers;
