import type { Todo } from '$lib/types/todo'
// import { error } from '@sveltejs/kit';

// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
const db = new Map();

export function getTodos(userid: string) {
	if (!db.has(userid)) {
		createTodo({ userid, description: `Learn about API routes` })
	}

	const todos: Todo[] = Array.from(db.get(userid).values());
	return todos;
}

export function createTodo({ userid, description }: {userid: string, description: string}) {
	if (!db.has(userid)) {
		db.set(userid, new Map());
	}

	const todos: Map<string, Todo> = db.get(userid);

	todos.forEach((todo, id) => {
		if (todo && (todo.description === description)) {
			console.error('[lib/server/database.ts]: todos must be unique');
      throw new Error('todos must be unique');
			// error(420, 'todos must be unique');
		}
	});

	const id = crypto.randomUUID();

	todos.set(id, {
		id,
		description,
		done: false
	})

	return { id };
}

export function toggleTodo({ userid, id, done }:  {userid: string, id: string, done: boolean}) {
	const todos: Map<string, Todo> = db.get(userid);
	let todo = todos.get(id);
	if (todo && todo.done) {
		todo.done = done;
	}
}

export function deleteTodo({ userid, id }: {userid: string, id: string}) {
	const todos: Map<string, Todo> = db.get(userid);
	const todo = todos.get(id);

	if (todo) {
		todos.delete(id);
	}
}
