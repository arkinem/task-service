import { testConnection } from "./connection";

const setup = async () => {
	await testConnection(true);
	process.exit();
};

setup();
