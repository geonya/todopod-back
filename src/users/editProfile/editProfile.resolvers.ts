import { protectResolver } from "../users.utils";
import { hash } from "bcrypt";
import { uploadToS3 } from "../../shared/shared.utils";
import { GraphQLUpload } from "graphql-upload";

export default {
	Mutation: {
		editProfile: protectResolver(
			async (
				_,
				{ username, email, password: newPassword, avatar },
				{ prisma, loggedInUser }
			) => {
				let hashedPassword = null;
				if (newPassword) {
					hashedPassword = await hash(newPassword, 10);
				}
				let avatarUrl = null;
				if (avatar) {
					avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
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
