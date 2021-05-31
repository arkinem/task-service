import { Connection } from "typeorm";
import faker from "faker";

import { graphql } from "../utils/graphql";
import { testConnection } from "../utils/connection";
import { Task } from "../../src/entities/Task";
import { messages } from "../../src/constants/messages";
import {
	runCreateTaskMutation,
	getRandomTaskName,
	taskQuery,
	tasksQuery,
	createTask,
} from "../utils/task";

let connection: Connection;

beforeEach(async () => {
	connection = await testConnection(true);
});

afterEach(async () => {
	await connection.close();
});

describe("TaskResolver", () => {
	describe("CreateTask", () => {
		it("creates task without parent", async () => {
			const task = {
				title: getRandomTaskName(),
			};

			const response = await runCreateTaskMutation(task.title);

			expect(response.data?.createTask).toEqual(expect.any(Number));

			const dbTask = await Task.findOne({ where: { title: task.title } });

			expect(dbTask).toBeDefined();
		});

		it("throws error if non existing parent specified", async () => {
			const task = {
				title: getRandomTaskName(),
				parentId: faker.datatype.number({ min: 5 }),
			};

			const response = await runCreateTaskMutation(task.title, task.parentId);

			expect(response.errors?.[0].message).toEqual(messages.ERROR_PARENT_DOESNT_EXIST);

			const dbTask = await Task.findOne({ where: { title: task.title } });

			expect(dbTask).toBeUndefined();
		});

		it("creates task with parent relation", async () => {
			const parentTask = {
				title: getRandomTaskName(),
			};

			const { data } = await runCreateTaskMutation(parentTask.title);

			const parentId = data?.createTask;

			const task = {
				title: getRandomTaskName(),
				parentId,
			};

			const response = await runCreateTaskMutation(task.title, task.parentId);

			expect(response.data?.createTask).toEqual(expect.any(Number));

			const dbTask = await Task.findOne({ where: { title: task.title } });

			expect(dbTask).toBeDefined();
		});
	});

	describe("Task", () => {
		it("gets task without parent", async () => {
			const task = await createTask();

			const response = await graphql({
				source: taskQuery,
				variableValues: {
					id: task.id,
				},
			});

			expect(response).toMatchObject({
				data: {
					task: {
						id: task.id.toString(),
						title: task.title,
						parent: null,
					},
				},
			});
		});

		it("gets deeply nested task", async () => {
			const firstTask = await createTask();
			const secondTask = await createTask(undefined, firstTask.id);
			const thirdTask = await createTask(undefined, secondTask.id);

			const response = await graphql({
				source: taskQuery,
				variableValues: {
					id: thirdTask.id,
				},
			});

			expect(response).toMatchObject({
				data: {
					task: {
						id: thirdTask.id.toString(),
						title: thirdTask.title,
						parent: {
							id: secondTask.id.toString(),
							title: secondTask.title,
							parent: {
								id: firstTask.id.toString(),
								title: firstTask.title,
							},
						},
					},
				},
			});
		});
	});

	describe("Tasks", () => {
		it("gets empty array when no tasks added", async () => {
			const response = await graphql({
				source: tasksQuery,
			});

			expect(response.data?.tasks).toHaveLength(0);
		});

		it("gets all tasks", async () => {
			const firstTask = await createTask();
			const secondTask = await createTask(undefined, firstTask.id);
			const thirdTask = await createTask(undefined, secondTask.id);

			const response = await graphql({
				source: tasksQuery,
			});

			expect(response.data?.tasks).toHaveLength(3);
			expect(response.data?.tasks[0]).toMatchObject({
				id: firstTask.id.toString(),
				title: firstTask.title,
				parent: null,
			});

			expect(response.data?.tasks[1]).toMatchObject({
				id: secondTask.id.toString(),
				title: secondTask.title,
				parent: {
					id: firstTask.id.toString(),
					title: firstTask.title,
				},
			});

			expect(response.data?.tasks[2]).toMatchObject({
				id: thirdTask.id.toString(),
				title: thirdTask.title,
				parent: {
					id: secondTask.id.toString(),
					title: secondTask.title,
					parent: {
						id: firstTask.id.toString(),
						title: firstTask.title,
					},
				},
			});
		});
	});
});
