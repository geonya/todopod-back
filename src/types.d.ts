import { PrismaClient, User } from "@prisma/client";

type Context = {
	loggedInUser: User;
	prisma: PrismaClient;
};

export type Resolver = (
	root: any,
	args: any,
	context: Context,
	inof: any
) => any;

export type Resolvers = {
	[key: string]: {
		[key: string]: Resolver;
	};
};
