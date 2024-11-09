<script>
    import { onMount } from "svelte";

    /** @type {number} */
    export let numberOfInputs = 6;

    /** @type {(val: string) => boolean} */
    export let validator = () => true;

    /** @type {string} */
    export let otpString = "";

    /** @type {string[]} */
    let boxValues = Array(numberOfInputs).fill("");

    /** @type {HTMLDivElement} */
    let otpRef;

    /** @type {number} */
    let focusedBox = 0;

    /**
     * @param {string} value
     * @param {number} index
     */
    function handleInput(value, index) {
        if (validator(value)) {
            boxValues[index] = value;
            otpString = boxValues.join("");
            focusNextBox(index);
        } else {
            boxValues[index] = "";
        }
    }

    /**
     * @param {number} currentIndex
     */
    function focusNextBox(currentIndex) {
        const nextBoxIndex = Math.min(currentIndex + 1, numberOfInputs - 1);
        focusedBox = nextBoxIndex;
        /** @type {HTMLInputElement} */ (otpRef.children[nextBoxIndex]).focus();
    }

    /**
     * @param {KeyboardEvent} event
     */
    function handleKeydown(event) {
        if (event.key === "Backspace" && focusedBox > 0) {
            boxValues[focusedBox] = "";
            focusedBox--;
            /** @type {HTMLInputElement} */ (
                otpRef.children[focusedBox]
            ).focus();
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    });
</script>

<div class="otp" bind:this={otpRef}>
    {#each boxValues as boxVal, idx}
        <input
            class="box"
            type="text"
            maxlength="1"
            on:input={(e) => handleInput(e.currentTarget.value, idx)}
            bind:value={boxVal}
        />
    {/each}
</div>

<style>
    .otp {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .box {
        all: unset;
        width: 3rem;
        aspect-ratio: 1/1;
        font-family: var(--bodyFont);
        font-size: var(--h4);
        font-weight: bold;
        text-align: center;
        color: var(--foregroundColor);
        background-color: var(--backgroundColor);
        border: 2px solid var(--foregroundColor);
        border-radius: var(--border-radius);
    }

    .box:focus {
        border-color: var(--primaryColor);
        color: var(--primaryColor);
    }
</style>
