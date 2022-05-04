import { AWS_S3_FOLDER } from "../../shared/shared.data";
import { makeHashtags, uploadToS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		uploadPhoto: protectResolver(
			async (
				_: any,
				{ file, caption, projectId },
				{ prisma, loggedInUser }
			) => {
				const fileUrl = await uploadToS3(
					file,
					loggedInUser.id,
					AWS_S3_FOLDER.photo
				);
				let hashtagsObjs = [];
				if (caption) {
					hashtagsObjs = makeHashtags(caption);
				}
				return prisma.photo.create({
					data: {
						user: {
							connect: {
								id: loggedInUser.id,
							},
						},
						project: {
							connect: {
								id: projectId,
							},
						},
						file: fileUrl,
						caption,
						...(hashtagsObjs.length > 0 && {
							hashtags: { connectOrCreate: hashtagsObjs },
						}),
					},
				});
			}
		),
	},
};

export default resolvers;
