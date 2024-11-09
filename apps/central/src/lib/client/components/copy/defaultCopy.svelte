<script>
    import CopyIcon from "../../icons/copyIcon.svelte";
    import DoneIcon from "../../icons/doneIcon.svelte";

    /** @type {string} */
    export let text;

    /** @type {'idle' | 'copying'} */
    let status = "idle";

    function copyToClipboard() {
        status = "copying";
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            status = "idle";
        }, 1200);
    }
</script>

<div class="copy">
    <span>{text}</span>
    <div class="status">
        {#if status == "idle"}
            <button class="action" on:click={() => copyToClipboard()}>
                <CopyIcon />
            </button>
        {:else}
            <DoneIcon />
        {/if}
    </div>
</div>

<style>
    .copy {
        width: var(--width, 100%);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        border: 2px solid var(--foregroundColor);
        border-radius: var(--border-radius);
    }
    .copy span {
        color: var(--foregroundColor);
    }
    .action {
        display: contents;
        cursor: pointer;
    }
    .status {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        border: 1px solid var(--primaryColor);
        border-radius: var(--border-radius);
    }
</style>
