import { createConnection } from "typeorm";

export const testConnection = (drop: boolean = false) => {
	return createConnection({
		type: "sqlite",
		database: "test_database.sqlite",
		entities: ["src/entities/**/*.ts"],
		migrations: ["src/migration/**/*.ts"],
		subscribers: ["src/subscriber/**/*.ts"],
		synchronize: drop,
		dropSchema: drop,
	});
};
