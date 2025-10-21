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
    if (userid && descdata) {
      const description = `${descdata}`;
      db.createTodo(userid, description);
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
};
