import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";

import { Task } from "../entities/Task";
import { resolveParents } from "../helpers/task";

@Resolver()
export class TaskResolver {
	@Mutation(() => Int)
	async createTask(
		@Arg("title") title: string,
		@Arg("parentId", () => Int, { nullable: true }) parentId?: number
	): Promise<number> {
		if (parentId) {
			const parent = await Task.findOne(parentId);

			if (!parent) {
				throw new Error("Parent doesn't exist");
			}
		}

		const { id } = await Task.create({ title, parentId }).save();

		return id;
	}

	@Query(() => [Task])
	async tasks(): Promise<Task[]> {
		const tasks = await Task.find();

		for (const task of tasks) {
			resolveParents(task, tasks);
		}

		return tasks;
	}

	@Query(() => Task, { nullable: true })
	async task(@Arg("taskId", () => Int) taskId: number): Promise<Task | null> {
		if (!taskId) {
			return null;
		}

		let task = await Task.findOne(taskId);

		if (task) {
			await resolveParents(task);
		}

		return task || null;
	}
}
