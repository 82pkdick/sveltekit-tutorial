<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import type { Todo } from "$lib/types/todo";
  import { fly, slide } from "svelte/transition";
  // import { enhance } from "$app/forms";

  interface Props {
    data: PageData;
    form: ActionData;
  }

  // let { data, form }: Props = $props();
  let { data }: Props = $props();

  // console.log("A01: ", data.todos);

  let todos: Todo[] = $state([]);

  let creating = $state(false);
  // let deleting: string[] = $state([]);

  let serverMessage = $state("");
  let messageClass: string | null = $state(null);

  const setResultMessage = ({
    success,
    message,
  }: {
    success: boolean;
    message: string;
  }) => {
    serverMessage = message;
    if (success) {
      messageClass = "success";
    } else {
      messageClass = "error";
    }

    setTimeout(() => {
      serverMessage = "";
      messageClass = null;
    }, 3000);
  };

  $effect(() => {
    todos = data.todos;
  });

  const addTodo = async (description: string) => {
    creating = true;
    try {
      const response = await fetch("/todo", {
        method: "POST",
        body: JSON.stringify({ description }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { id, ok, message } = await response.json();

      if (ok) {
        const todos = [
          ...data.todos,
          {
            id,
            description,
            done: false,
          },
        ];

        data = { ...data, todos };
        setResultMessage({ success: true, message });
      } else {
        throw new Error(message);
      }
    } catch (error: any) {
      setResultMessage({ success: false, message: `Error: ${error.message}` });
    } finally {
      creating = false;
    }
  };

  const toggleTodo = async (todoid: string, done: boolean) => {
    try {
      await fetch(`/todo/${todoid}`, {
        method: "PUT",
        body: JSON.stringify({ done }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      setResultMessage({ success: false, message: `Error: ${error.message}` });
    }
  };

  const deleteTodo = async (todoid: string) => {
    try {
      await fetch(`/todo/${todoid}`, {
        method: "DELETE",
      });

      const todos = data.todos.filter((t) => t.id !== todoid);

      data = { ...data, todos };
    } catch (error: any) {
      setResultMessage({ success: false, message: `Error: ${error.message}` });
    }
  };
</script>

<div class="centered">
  <h1>todos</h1>

  {#if serverMessage}
    <p class={messageClass ? messageClass : ""}>{serverMessage}</p>
  {/if}

  {#if creating}
    <span class="saving">saving...</span>
  {/if}

  <label>
    add a todo:
    <input
      type="text"
      autocomplete="off"
      onkeydown={async (e) => {
        if (e.key !== "Enter") {
          return;
        }

        const input = e.currentTarget;
        const description = input.value;

        await addTodo(description);

        input.value = "";
      }}
    />
  </label>

  <ul class="todos">
    {#each todos as todo (todo.id)}
      <li>
        <label>
          <input
            type="checkbox"
            checked={todo.done}
            onchange={async (e) => {
              const done = e.currentTarget.checked;
              await toggleTodo(todo.id, done);
            }}
          />
          <span>{todo.description}</span>
          <button
            aria-label="Mark as complete"
            onclick={async (e) => {
              await deleteTodo(todo.id);
            }}
          ></button>
        </label>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .centered {
    max-width: 20em;
    margin: 0 auto;
  }

  label {
    display: flex;
    width: 100%;
  }

  input[type="text"] {
    flex: 1;
  }

  span {
    flex: 1;
  }

  button {
    border: none;
    background: url(./remove.svg) no-repeat 50% 50%;
    background-size: 1rem 1rem;
    cursor: pointer;
    height: 100%;
    aspect-ratio: 1;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  button:hover {
    opacity: 1;
  }

  .error {
    color: firebrick;
  }

  .success {
    color: green;
  }

  .saving {
    opacity: 0.5;
    color: teal;
  }
</style>
