import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		deleteProject: protectResolver(
			async (_: any, { id }, { prisma, loggedInUser }) => {
				const existingProject = await prisma.project.findFirst({
					where: {
						id,
						userId: loggedInUser.id,
					},
					select: {
						id: true,
					},
				});
				if (!existingProject) {
					return {
						ok: false,
						error: "project not found.",
					};
				}
				await prisma.project.delete({
					where: { id },
				});
				return {
					ok: true,
				};
			}
		),
	},
};

export default resolvers;
