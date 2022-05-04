import { Resolvers } from "../../types";

const resolvers: Resolvers = {
	Query: {
		seeHashtags: (_: any, __: any, { prisma }) =>
			prisma.hashtag.findMany({ select: { hashtag: true } }),
	},
};

export default resolvers;
