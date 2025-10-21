<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import type { Todo } from "$lib/types/todo";
  import { fly, slide } from "svelte/transition";
  import { enhance } from "$app/forms";

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();

  let todos: Todo[] = $state([]);

  let creating = $state(false);
  let deleting: string[] = $state([]);

  let serverMessage = $state("");
  let messageClass: string | null = $state(null);

  const setResultMessage = () => {
    if (form?.error) {
      serverMessage = form.error;
      messageClass = "error";
    }
    if (form?.message) {
      serverMessage = form.message;
      messageClass = "success";
    }
  };

  $effect(() => {
    setResultMessage();
    setTimeout(() => {
      serverMessage = "";
      messageClass = null;
    }, 2000);
    todos = data.todos;
  });
</script>

<div class="centered">
  <h1>todos</h1>

  {#if serverMessage}
    <p class={messageClass ? messageClass : ""}>{serverMessage}</p>
  {/if}

  {#if creating}
    <span class="saving">saving...</span>
  {/if}

  <form
    method="POST"
    action="?/create"
    use:enhance={() => {
      creating = true;
      return async ({ update }) => {
        await update();
        creating = false;
      };
    }}
  >
    <label>
      add a todo:
      <input
        type="text"
        name="description"
        autocomplete="off"
        disabled={creating}
      />
    </label>
  </form>

  <ul class="todos">
    {#each todos.filter((todo) => !deleting.includes(todo.id)) as todo (todo.id)}
      <li in:fly={{ y: 20 }} out:slide>
        <form
          method="POST"
          action="?/delete"
          use:enhance={() => {
            deleting = [...deleting, todo.id];
            return async ({ update }) => {
              await update();
              deleting = deleting.filter((id) => id !== todo.id);
            };
          }}
        >
          <input type="hidden" name="id" value={todo.id} />
          <span>{todo.description}</span>
          <button aria-label="Mark as complete"></button>
        </form>
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
    width: 100%;
  }

  input {
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
