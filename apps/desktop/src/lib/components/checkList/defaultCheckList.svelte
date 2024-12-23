<script>
  import { createEventDispatcher } from "svelte";
  import CheckItem from "./checkItem.svelte";

  /**@type {import("../../types").checkItem[]}*/
  export let checkList = [];

  const dispatcher = createEventDispatcher();
  /**
   * @function toggleCheckListItem
   * This function handles the toggling of the checked property for a specific checkList item upon a click event.
   * It triggers a custom "change" event with a detail object containing information about the clicked item's index and its updated checked status.
   * @param {number} itemIndex - The index of the checkList item that changed its status.
   */
  function toggleCheckListItem(itemIndex) {
    if (checkList[itemIndex].disabled) return;
    const oldStatus = checkList[itemIndex].checked;
    checkList[itemIndex].checked = !oldStatus;
    dispatcher("change", {
      checked: checkList[itemIndex].checked,
      itemIndex,
    });
  }
</script>

<div class="checkList">
  {#each checkList as checkItem, index}
    <CheckItem {checkItem} on:click={() => toggleCheckListItem(index)} />
  {/each}
</div>

<style>
  .checkList {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>
