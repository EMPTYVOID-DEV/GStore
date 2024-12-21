<script lang="ts">
  import { fetch } from "@tauri-apps/plugin-http";

  let { data } = $props();

  async function setSomething() {
    data.store.set("key", "value");
  }
  async function send() {
    const data = await fetch(" http://localhost:3001/info/api-info").then(
      (data) => data.json()
    );
    console.log(data);
  }
</script>

{#await data.store.get("key")}
  <span>loading</span>
{:then key}
  <span>{key}</span>
{/await}

<button onclick={send}>set</button>
