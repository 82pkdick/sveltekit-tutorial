import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import * as db from "$lib/server/database.js";

export async function load({ cookies }) {
  await new Promise((fulfil) => setTimeout(fulfil, 2000));

  let userid = cookies.get("userid");

  if (!userid) {
    userid = crypto.randomUUID();
    cookies.set("userid", userid, { path: "/" });
  }

  return {
    todos: db.getTodos(userid),
  };
}

// export const actions = {
//   create: async ({ cookies, request }) => {
//     // await new Promise((fulfil) => setTimeout(fulfil, 1000));
//     const data = await request.formData();
//     const userid = cookies.get("userid");
//     const descdata: FormDataEntryValue | null = data.get("description");
//     const description = `${descdata}`;
//     try {
//       if (userid && descdata) {
//         db.createTodo(userid, description);
//         return { message: "create todo success!" };
//       } else {
//         throw new Error('can not find userid or description');
//       }
//     } catch (error: any) {
//       return fail(422, {
//         description: description,
//         error: error.message
//       });
//     }
//   },

//   delete: async ({ cookies, request }) => {
//     // await new Promise((fulfil) => setTimeout(fulfil, 500));
//     const data = await request.formData();
//     const userid = cookies.get('userid');
//     const dataid: FormDataEntryValue | null = data.get('id');
//     try {
//       if (userid && dataid) {
//         const id = `${dataid}`;
//         db.deleteTodo(userid, id);
//         return { message: "delete one todo" };
//       } else {
//         throw new Error('can not find userid or description');
//       }
//     } catch (error: any) {
//       return fail(422, {
//         error: error.message
//       });
//     }
//   }
// } satisfies Actions;
