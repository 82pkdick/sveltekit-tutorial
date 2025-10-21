// In a real app, this data would live in a database,
// rather than in memory. But for now, we cheat.
const db = new Map();

type Todo = {
	id: string;
	description: string;
	done: boolean;
};

export function getTodos(userid: string) {
	if (!db.get(userid)) {
		db.set(userid, [{
			id: crypto.randomUUID(),
			description: 'Learn SvelteKit',
			done: false
		}]);
	}

	return db.get(userid);
}

export function createTodo(userid: string, description: string) {
	if (!userid) {
		return;
	}

	const todos: Todo[] = db.get(userid);

	todos.push({
		id: crypto.randomUUID(),
		description,
		done: false
	});
}

export function deleteTodo(userid: string, todoid: string) {
	const todos: Todo[] = db.get(userid);
	const index = todos.findIndex((todo) => todo.id === todoid);

	if (index !== -1) {
		todos.splice(index, 1);
	}
}
