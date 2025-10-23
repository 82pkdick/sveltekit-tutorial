import * as database from '$lib/server/database.js';

export async function PUT({ params, request, cookies }) {
  const { done } = await request.json();
  const userid = cookies.get('userid');

  try {
    if (userid) {
      await database.toggleTodo({ userid, id: params.id, done });
      return new Response(null, { status: 204 });
    }
  } catch (error) {
    throw new Error('[/todo/[id]/+server.ts: 13]: can not set done');
  }
}

export async function DELETE({ params, cookies }) {
  const userid = cookies.get('userid');

  try {
    if (userid) {
      await database.deleteTodo({ userid, id: params.id });
      return new Response(null, { status: 204 });
    }
  } catch (error) {
    throw new Error('[/todo/[id]/+server.ts: 26]: can not delete todo');
  }
}