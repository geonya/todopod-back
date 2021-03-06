require("dotenv").config();
import * as express from "express";
import * as morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphqlUploadExpress } from "graphql-upload";
import { typeDefs, resolvers } from "./schema";
import prisma from "./prisma";
import { getUser } from "./users/users.utils";

const startServer = async () => {
	const app = express();
	app.use(morgan("dev"));
	app.use("/static", express.static("uploads"));
	app.use(graphqlUploadExpress());
	const httpServer = createServer(app);
	const schema = makeExecutableSchema({ typeDefs, resolvers });
	const apolloServer = new ApolloServer({
		schema,
		context: async ({ req }) => {
			if (req) {
				return {
					loggedInUser: await getUser(req.headers.token),
					prisma,
				};
			}
		},
	});
	await apolloServer.start();
	apolloServer.applyMiddleware({ app });
	httpServer.listen(process.env.PORT, () =>
		console.log(
			`🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath} ✅`
		)
	);
};

startServer();
