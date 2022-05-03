import { Resolvers } from "../../types";
import * as bcrypt from "bcrypt";

const resolvers: Resolvers = {
	Mutation: {
		createAccount: async (
			_: any,
			{ username, email, password },
			{ prisma }
		) => {
			try {
				const existingUser = await prisma.user.findUnique({
					where: {
						username,
					},
				});
				if (existingUser) {
					return {
						ok: false,
						error: "User is existing",
					};
				}
				const hashedPassword = await bcrypt.hash(password, 10);
				await prisma.user.create({
					data: {
						username,
						email,
						password: hashedPassword,
					},
				});
				return {
					ok: true,
				};
			} catch (e) {
				console.log(e);
				return {
					ok: false,
					error: "Can't create account.",
				};
			}
		},
	},
};

export default resolvers;
