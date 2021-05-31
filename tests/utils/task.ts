import faker from "faker";
import { Task } from "../../src/entities/Task";
import { graphql } from "./graphql";

export const createTaskMutation = `
mutation CreateTask($title: String!, $parentId: Int) {
  createTask(title: $title, parentId: $parentId)
}
`;

export const taskQuery = `
query Task($id: Int!) {
  task(id: $id) {
    id
    title
    parent {
      id
      title
      parent {
        id
        title
      }
    }
  }
}
`;

export const tasksQuery = `
{
  tasks {
    id
    title
    parent {
      id
      title
      parent {
        id
        title
      }
    }
  }
}
`;

export const runCreateTaskMutation = async (title: string, parentId?: number) => {
	return await graphql({
		source: createTaskMutation,
		variableValues: {
			title,
			parentId,
		},
	});
};

export const createTask = async (title: string = getRandomTaskName(), parentId?: number) => {
	return await Task.create({
		title,
		parentId,
	}).save();
};

export const getRandomTaskName = () => {
	return faker.random.words(4);
};
