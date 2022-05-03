import { prisma } from "@prisma/client";
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		editProject: protectResolver(
			async (
				_: any,
				{ id, title, description, clientName, deadline },
				{ prisma, loggedInUser }
			) => {
				const existingProject = await prisma.project.findFirst({
					where: { id, userId: loggedInUser.id },
					select: { id: true },
				});
				if (!existingProject) {
					return {
						ok: false,
						error: "project not found.",
					};
				}
				const clientObj = { name: clientName };
				await prisma.project.update({
					where: { id },
					data: {
						title,
						description,
						...(clientName && {
							client: {
								connectOrCreate: {
									where: clientObj,
									create: clientObj,
								},
							},
						}),
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
