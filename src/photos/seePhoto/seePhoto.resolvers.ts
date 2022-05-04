import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Query: {
		seePhoto: async (_: any, { id }, { prisma }) =>
			prisma.photo.findUnique({ where: { id } }),
	},
};

export default resolvers;
