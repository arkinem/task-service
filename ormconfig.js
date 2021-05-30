module.exports = {
	type: "sqlite",
	database: "database.sqlite",
	synchronize: true,
	logging: true,
	entities: ["src/entities/**/*.ts"],
	migrations: ["src/migration/**/*.ts"],
	subscribers: ["src/subscriber/**/*.ts"],
	cli: {
		entitiesDir: "src/entities",
		migrationsDir: "src/migration",
		subscribersDir: "src/subscriber",
	},
};
