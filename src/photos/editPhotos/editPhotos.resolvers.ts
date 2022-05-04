import { AWS_S3_FOLDER } from "../../shared/shared.data";
import {
	deleteFromS3,
	makeHashtags,
	uploadToS3,
} from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		editPhoto: protectResolver(
			async (_: any, { id, file, caption }, { prisma, loggedInUser }) => {
				const foundPhoto = await prisma.photo.findFirst({
					where: { id, userId: loggedInUser.id },
					include: {
						hashtags: {
							select: {
								hashtag: true,
							},
						},
					},
				});
				if (!foundPhoto) {
					return {
						ok: false,
						error: "Photo not found!",
					};
				}
				let hashtagsObjs = [];
				if (caption) {
					hashtagsObjs = makeHashtags(caption);
				}
				let fileUrl = null;
				if (file) {
					fileUrl = await uploadToS3(
						file,
						loggedInUser.id,
						AWS_S3_FOLDER.photo
					);
					// previous photo delete
					await deleteFromS3(foundPhoto.file, AWS_S3_FOLDER.photo);
				}
				await prisma.photo.update({
					where: {
						id,
					},
					data: {
						...(fileUrl && { file: fileUrl }),
						caption,
						hashtags: {
							disconnect: foundPhoto.hashtags,
							connectOrCreate: hashtagsObjs,
						},
					},
				});
				return { ok: true };
			}
		),
	},
};
export default resolvers;
