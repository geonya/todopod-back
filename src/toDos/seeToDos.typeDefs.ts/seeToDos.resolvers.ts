import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Query: {
		seeToDos: protectResolver(
			async (_: any, { userId, projectId }, { prisma, loggedInUser }) => {
				if (userId === undefined && projectId === undefined) {
					return null;
				}
				return prisma.toDo.findMany({
					where: {
						AND: [
							{ ...(userId && { userId }) },
							{ ...(projectId && { projectId }) },
						],
					},
				});
			}
		),
	},
};

export default resolvers;
