import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import * as db from "$lib/server/database.js";

export function load({ cookies }) {
  let id = cookies.get("userid");

  if (!id) {
    id = crypto.randomUUID();
    cookies.set("userid", id, { path: "/" });
  }

  return {
    todos: db.getTodos(id),
  };
}

export const actions = {
  create: async ({ cookies, request }) => {
    const data = await request.formData();
    const userid = cookies.get("userid");
    const descdata: FormDataEntryValue | null = data.get("description");
    const description = `${descdata}`;
    try {
      if (userid && descdata) {
        db.createTodo(userid, description);
        return { message: "create todo success!" };
      } else {
        throw new Error('can not find userid or description');
      }
    } catch (error: any) {
      return fail(422, {
        description: description,
        error: error.message
      });
    }
  },

  delete: async ({ cookies, request }) => {
    const data = await request.formData();
    const userid = cookies.get('userid');
    const dataid: FormDataEntryValue | null = data.get('id');
    if (userid && dataid) {
      const id = `${dataid}`;
      db.deleteTodo(userid, id);
    }
  }
} satisfies Actions;
