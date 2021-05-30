import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { createConnection, getConnectionOptions } from "typeorm";

import { TaskResolver } from "./resolvers/TaskResolver";

const main = async () => {
	const app = express();

	const options = await getConnectionOptions();
	await createConnection({ ...options, name: "default" });

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [TaskResolver],
			validate: true,
		}),
		context: ({ req, res }) => ({ req, res }),
	});

	apolloServer.applyMiddleware({ app, cors: false });

	const port = process.env.PORT || 4000;

	app.listen(port, () => {
		console.log(`server started at http://localhost:${port}/graphql`);
	});
};

main();
