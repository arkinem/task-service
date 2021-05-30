import { Task } from "../entities/Task";

/**
 * When task collection is provided, parents will be resolved from
 * it instead of database.
 *
 * @param taskId if of a task to get
 * @param tasks (optional) tasks collection to resolve task from
 * @returns found task or null
 */
const getTask = async (taskId: number, tasks?: Task[]): Promise<Task | null> => {
	let result;

	if (tasks) {
		result = tasks.find((t) => t.id === taskId);
	} else {
		result = await Task.findOne(taskId);
	}

	return result || null;
};

/**
 * Mutable function that resolves parents for a given task. When task collection
 * is provided, parents will be resolved from it instead of database.
 *
 * @param task task to resolve parents for
 * @param tasks (optional) tasks collection to resolve parents from
 */
export const resolveParents = async (task: Task, tasks?: Task[]) => {
	if (task.parentId) {
		const parent = await getTask(task.parentId, tasks);
		task.parent = parent || null;

		if (parent) {
			await resolveParents(parent, tasks);
		}
	}
};
