import { Resolvers } from "../../types";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const resolvers: Resolvers = {
	Mutation: {
		login: async (_: any, { username, password }, { prisma }) => {
			const user = await prisma.user.findUnique({ where: { username } });
			if (!user) {
				return {
					ok: false,
					error: "User not found.",
				};
			}
			const passwordOk = await compare(password, user.password);
			if (!passwordOk) {
				return {
					ok: false,
					error: "Password Error",
				};
			}
			const token = sign({ id: user.id }, process.env.SECRET_KEY);
			return {
				ok: true,
				token,
			};
		},
	},
};

export default resolvers;
