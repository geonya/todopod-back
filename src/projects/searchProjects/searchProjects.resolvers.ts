import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Query: {
		searchProjects: (_: any, { keyword }, { prisma }) =>
			prisma.project.findMany({
				where: {
					OR: [
						{ title: { contains: keyword } },
						{ description: { contains: keyword } },
					],
				},
			}),
	},
};
export default resolvers;
