import { verify } from "jsonwebtoken";
import { Resolver } from "../types";
import prisma from "../prisma";
export const getUser = async (token: string) => {
	try {
		if (!token) {
			return null;
		}
		const verifiedToken: any = verify(token, process.env.SECRET_KEY);
		if ("id" in verifiedToken) {
			const user = await prisma.user.findUnique({
				where: { id: verifiedToken["id"] },
			});
			if (user) {
				return user;
			}
		}
		return null;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const protectResolver =
	(ourResolver: Resolver) => (root, args, context, info) => {
		if (!context.loggedInUser) {
			const isQueries = info.operation.operation === "query";
			if (isQueries) {
				return null;
			} else {
				return {
					ok: false,
					error: "You need to Login first!",
				};
			}
		}
		return ourResolver(root, args, context, info);
	};
