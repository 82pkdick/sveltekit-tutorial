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
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const id = cookies.get("userid");
    const descdata: FormDataEntryValue | null = data.get("description");
    if (id && descdata) {
      const description = `${descdata}`;
      db.createTodo(id, description);
    }
  },
};
