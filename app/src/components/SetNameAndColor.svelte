<script>
    import { onMount } from "svelte";
    let nameRef;
    let { displayName = $bindable(), currentColor = $bindable() } = $props();

    const getDisplayColors = () => {
        const colorsNum = 15;
        const step = 360 / colorsNum;

        const hues = [];
        for (let i = 0; i < 360; i += step) {
            hues.push(Math.round(i));
        }

        return hues;
    };

    onMount(() => nameRef.focus());
</script>

<label for="display-name">Display name:</label>
<input
    id="display-name"
    type="text"
    bind:value={displayName}
    bind:this={nameRef}
/>

<p>Display color:</p>
<div class="display-color-selector">
    {#each getDisplayColors() as hue}
        <div
            class="display-color-option {hue == currentColor ? 'active' : ''}"
            style="background: hsl({hue}deg 100% 50%)"
            onclick={() => (currentColor = hue)}
        ></div>
    {/each}
</div>
