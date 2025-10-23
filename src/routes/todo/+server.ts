import { json } from "@sveltejs/kit";

import * as database from "$lib/server/database.js";

export async function POST({ request, cookies }) {
  await new Promise((fulfil) => setTimeout(fulfil, 3000));
  try {
    let { description } = await request.json();

    if (description === '') {
      throw new Error('todo must have a description');
    }

    const userid = cookies.get("userid");

    if (!userid || !description) {
      return json({ ok: false }, { status: 506 })
    }

    const { id } = await database.createTodo({ userid, description });
    const message = "create todo success!";
    return json({ id, ok: true, message }, { status: 201 });
  } catch (error: any) {
    console.error(`[/todo/+server.ts]: ${error.message}`);
    return json({ id: null, ok: false, message: `${error.message}` }, { status: 422 });
  }
}
