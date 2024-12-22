<div class="formWrapper">
  <slot />
  <div class="submitter">
    <slot name="submitter" />
  </div>
</div>

<style>
  .formWrapper {
    --bg-opacity: 8%;
    background-color: color-mix(
      in srgb,
      var(--primaryColor) var(--bg-opacity),
      transparent
    );
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--mutedColor);
    border-radius: var(--border-radius);
  }
  .submitter {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: var(--justify, space-between);
    padding-inline: 1rem;
    padding-block: 0.5rem;
    border-top: 1px solid var(--mutedColor);
  }

  @media screen and (width <768px) {
    .submitter {
      flex-direction: column;
      align-items: flex-end;
      gap: 1rem;
    }
  }
</style>
