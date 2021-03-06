import { makeHashtags } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		createProject: protectResolver(
			async (
				_: any,
				{ title, description, clientName, deadline },
				{ prisma, loggedInUser }
			) => {
				const clientObj = { name: clientName };
				let hashtagsObjs = [];
				if (description) {
					hashtagsObjs = makeHashtags(description);
				}
				return prisma.project.create({
					data: {
						user: {
							connect: {
								id: loggedInUser.id,
							},
						},
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
						...(hashtagsObjs.length > 0 && {
							hashtags: {
								connectOrCreate: hashtagsObjs,
							},
						}),
						deadline,
					},
				});
			}
		),
	},
};

export default resolvers;
