import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		deleteToDo: protectResolver(
			async (_: any, { id }, { prisma, loggedInUser }) => {
				const exsitingToDo = await prisma.toDo.findFirst({
					where: {
						id,
					},
					select: {
						userId: true,
					},
				});
				if (!exsitingToDo) {
					return {
						ok: false,
						error: "ToDo not found.",
					};
				} else if (exsitingToDo.userId !== loggedInUser.id) {
					return {
						ok: false,
						error: "Not authorized.",
					};
				} else {
					await prisma.toDo.delete({
						where: { id },
					});
					return {
						ok: true,
					};
				}
			}
		),
	},
};

export default resolvers;
