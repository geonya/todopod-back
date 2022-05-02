import { Resolvers } from "../../types";
import { protectResolver } from "../users.utils";
import { hash } from "bcrypt";
import { uploadToS3 } from "../../shared/shared.utils";

const resolvers: Resolvers = {
	Mutation: {
		editProfile: protectResolver(
			async (
				_: any,
				{ username, email, password: newPassword, avatar },
				{ client, loggedInUser }
			) => {
				let hashedPassword = null;
				if (newPassword) {
					hashedPassword = await hash(newPassword, 10);
				}
				let avatarUrl = null;
				if (avatar) {
					avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
				}
				const updatedUser = await client.user.update({
					where: {
						id: loggedInUser.id,
					},
					data: {
						username,
						email,
						...(hashedPassword && { password: hashedPassword }),
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
};

export default resolvers;
