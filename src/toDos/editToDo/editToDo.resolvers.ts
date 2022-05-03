import { prisma } from "@prisma/client";
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		editToDo: protectResolver(
			async (_: any, { id, work }, { prisma, loggedInUser }) => {
				const existionTodo = await prisma.toDo.findFirst({
					where: {
						id,
						userId: loggedInUser.id,
					},
					select: {
						id: true,
					},
				});
				if (!existionTodo) {
					return {
						ok: false,
						error: "todo not found",
					};
				}
				await prisma.toDo.update({
					where: {
						id,
					},
					data: {
						work,
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
