import { error } from "@sveltejs/kit";

export function load() {
  throw new Error("Kaboon!");
}
