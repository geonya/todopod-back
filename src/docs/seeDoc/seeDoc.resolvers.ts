import { prisma } from "@prisma/client";
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Query: {
		seeDoc: protectResolver(async (_: any, { id }, { prisma }) =>
			prisma.doc.findUnique({ where: { id } })
		),
	},
};

export default resolvers;
