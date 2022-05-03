import { Resolvers } from "../../types";
import { protectResolver } from "../users.utils";

const resolvers: Resolvers = {
	Query: {
		seeProfile: protectResolver(
			async (_: any, { username }, { prisma }) =>
				await prisma.user.findUnique({
					where: {
						username,
					},
				})
		),
	},
};

export default resolvers;
