import { makeHashtags, uploadToS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";
import { AWS_S3_FOLDER } from "../../shared/shared.data";

const resolvers: Resolvers = {
	Mutation: {
		uploadDoc: protectResolver(
			async (
				_: any,
				{ file, projectId, caption },
				{ prisma, loggedInUser }
			) => {
				const fileUrl = await uploadToS3(
					file,
					loggedInUser.id,
					AWS_S3_FOLDER.doc
				);
				return prisma.doc.create({
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
					},
				});
			}
		),
	},
};

export default resolvers;
