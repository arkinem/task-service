import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection, getConnectionOptions } from "typeorm";

import { createSchema } from "./schema";

const main = async () => {
	const app = express();

	const options = await getConnectionOptions();
	await createConnection({ ...options, name: "default" });

	const schema = await createSchema();

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => ({ req, res }),
	});

	apolloServer.applyMiddleware({ app, cors: false });

	const port = process.env.PORT || 4000;

	app.listen(port, () => {
		console.log(`server started at http://localhost:${port}/graphql`);
	});
};

main();
