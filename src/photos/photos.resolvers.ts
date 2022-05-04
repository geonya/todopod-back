import { Resolvers } from "../types";

const resolvers: Resolvers = {
	Photo: {
		user: ({ userId }, _: any, { prisma }) =>
			prisma.user.findUnique({ where: { id: userId } }),
		project: ({ projectId }, _: any, { prisma }) =>
			prisma.project.findUnique({ where: { id: projectId } }),
		hashtags: ({ id }, _: any, { prisma }) =>
			prisma.hashtag.findMany({ where: { photos: { some: { id } } } }),
	},
};

export default resolvers;
