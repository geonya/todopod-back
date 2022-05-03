import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Query: {
		seeProject: (_: any, { id }, { prisma }) =>
			prisma.project.findUnique({ where: { id } }),
	},
};

export default resolvers;
