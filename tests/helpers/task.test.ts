import { Connection } from "typeorm";

import { resolveParents } from "../../src/helpers/task";
import { testConnection } from "../utils/connection";
import { createTask } from "../utils/task";

let connection: Connection;

beforeEach(async () => {
	connection = await testConnection(true);
});

afterEach(async () => {
	await connection.close();
});

describe("task helpers", () => {
	describe("resolveParents", () => {
		describe("using DB", () => {
			it("leaves task unchanged if it has no parent", async () => {
				const task = await createTask();

				await resolveParents(task);

				expect(task.parent).toBeUndefined();
			});

			it("returns task with its parent", async () => {
				const parent = await createTask();
				const task = await createTask(undefined, parent.id);

				await resolveParents(task);

				expect(task).toMatchObject({
					...task,
					parent: {
						...parent,
					},
				});
			});

			it("returns task with deeply nested parents", async () => {
				const firstTask = await createTask();
				const secondTask = await createTask(undefined, firstTask.id);
				const thirdTask = await createTask(undefined, secondTask.id);

				await resolveParents(thirdTask);

				expect(thirdTask).toMatchObject({
					...thirdTask,
					parent: {
						...secondTask,
						parent: { ...firstTask },
					},
				});
			});
		});

		describe("using task collection argument", () => {
			it("leaves task unchanged if it has no parent", async () => {
				const task = await createTask();
				const tasks = [task];

				await resolveParents(task, tasks);

				expect(task.parent).toBeUndefined();
			});

			it("returns task with its parent", async () => {
				const parent = await createTask();
				const task = await createTask(undefined, parent.id);

				const tasks = [parent, task];

				await resolveParents(task, tasks);

				expect(task).toMatchObject({
					...task,
					parent: {
						...parent,
					},
				});
			});

			it("returns task with deeply nested parents", async () => {
				const firstTask = await createTask();
				const secondTask = await createTask(undefined, firstTask.id);
				const thirdTask = await createTask(undefined, secondTask.id);

				const tasks = [firstTask, secondTask, thirdTask];

				await resolveParents(thirdTask, tasks);

				expect(thirdTask).toMatchObject({
					...thirdTask,
					parent: {
						...secondTask,
						parent: {
							...firstTask,
						},
					},
				});
			});
		});
	});
});
