import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolves: Resolvers = {
	Query: {
		seeToDo: protectResolver(async (_: any, { id }, { prisma, loggedInUser }) =>
			prisma.toDo.findFirst({ where: { id, userId: loggedInUser.id } })
		),
	},
};

export default resolves;
