import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		createToDo: protectResolver(
			async (
				_: any,
				{ work, projectId, deadline },
				{ prisma, loggedInUser }
			) => {
				const existingProject = await prisma.project.findUnique({
					where: { id: projectId },
					select: { id: true },
				});
				if (!existingProject) {
					return {
						ok: false,
						error: "project not found.",
					};
				}
				await prisma.toDo.create({
					data: {
						user: {
							connect: {
								id: loggedInUser.id,
							},
						},
						project: {
							connect: {
								id: projectId,
							},
						},
						work,
						deadline,
					},
				});
				return {
					ok: true,
				};
			}
		),
	},
};

export default resolvers;
