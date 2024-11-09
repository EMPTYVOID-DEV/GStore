<script>
  /** @type {string} */
  export let avatar = "";
</script>

<div class="avatar">
  {#if avatar}
    <img src={avatar} alt="avatar" />
  {:else}
    <span class="default" />
  {/if}
</div>

<style>
  .avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--width, 2.6rem);
    aspect-ratio: 1/1;
    border-radius: 50%;
    border: 0.3rem solid var(--color, transparent);
  }

  .avatar img {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
  }

  .avatar .default {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      var(--primaryColor),
      var(--foregroundColor)
    );
  }
</style>
