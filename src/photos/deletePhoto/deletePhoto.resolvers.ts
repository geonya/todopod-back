import { AWS_S3_FOLDER } from "../../shared/shared.data";
import { deleteFromS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
	Mutation: {
		deletePhoto: protectResolver(
			async (_: any, { id }, { prisma, loggedInUser }) => {
				const foundPhoto = await prisma.photo.findUnique({
					where: { id },
					select: {
						userId: true,
						file: true,
					},
				});
				if (!foundPhoto) {
					return {
						ok: false,
						error: "Photo not found.",
					};
				}
				if (foundPhoto.userId !== loggedInUser.id) {
					return {
						ok: false,
						error: "No Authorized.",
					};
				}
				await deleteFromS3(foundPhoto.file, AWS_S3_FOLDER.photo);
				await prisma.photo.delete({
					where: { id },
				});
				return {
					ok: true,
				};
			}
		),
	},
};

export default resolvers;
