module.exports = {
	type: "sqlite",
	database: "database.sqlite",
	synchronize: true,
	logging: true,
	entities: ["src/entities/**/*.*"],
};
