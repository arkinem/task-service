import { graphql as graphQL, GraphQLSchema } from "graphql";
import { Maybe } from "type-graphql";

import { createSchema } from "../../src/schema";

interface Options {
	source: string;
	variableValues?: Maybe<{
		[key: string]: any;
	}>;
	id?: number;
}

let schema: GraphQLSchema;

export const graphql = async ({ source, variableValues }: Options) => {
	if (!schema) {
		schema = await createSchema();
	}

	return graphQL({
		schema,
		source,
		variableValues,
	});
};
