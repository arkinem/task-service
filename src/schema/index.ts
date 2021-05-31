import { buildSchema } from "type-graphql";

import { TaskResolver } from "../resolvers/TaskResolver";

export const createSchema = async () =>
	await buildSchema({
		resolvers: [TaskResolver],
		validate: true,
	});
