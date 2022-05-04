import { protectResolver } from "../users.utils";
import { hash } from "bcrypt";
import { deleteFromS3, uploadToS3 } from "../../shared/shared.utils";
import { GraphQLUpload } from "graphql-upload";
import { AWS_S3_FOLDER } from "../../shared/shared.data";

export default {
	Mutation: {
		editProfile: protectResolver(
			async (
				_,
				{ username, email, password: newPassword, avatar },
				{ prisma, loggedInUser }
			) => {
				const foundUser = await prisma.user.findUnique({
					where: { id: loggedInUser.id },
					select: { avatar: true },
				});
				let hashedPassword = null;
				if (newPassword) {
					hashedPassword = await hash(newPassword, 10);
				}
				let avatarUrl = null;
				if (avatar) {
					avatarUrl = await uploadToS3(
						avatar,
						loggedInUser.id,
						AWS_S3_FOLDER.avatar
					);
					// previous photo delete
					await deleteFromS3(foundUser.avatar, AWS_S3_FOLDER.avatar);
				}
				const updatedUser = await prisma.user.update({
					where: {
						id: loggedInUser.id,
					},
					data: {
						username,
						email,
						...(hashedPassword && { password: hashedPassword }),
						...(avatarUrl && { avatar: avatarUrl }),
					},
				});
				if (updatedUser.id) {
					return {
						ok: true,
					};
				} else {
					return {
						ok: false,
						error: "Can't update profile",
					};
				}
			}
		),
	},
	Upload: GraphQLUpload,
};
