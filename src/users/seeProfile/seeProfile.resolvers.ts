import { Resolvers } from "../../types";
import { protectResolver } from "../users.utils";

const resolvers: Resolvers = {
	Query: {
		seeProfile: protectResolver(
			async (_: any, { username }, { client }) =>
				await client.user.findUnique({
					where: {
						username,
					},
				})
		),
	},
};

export default resolvers;
