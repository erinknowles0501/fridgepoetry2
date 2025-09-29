<script>
    import { onMount } from "svelte";
    import { auth } from "../stores.js";

    auth.emailVerified = true;

    console.log("auth", auth);

    let displayName = $state("");
    let nameRef;

    onMount(() => nameRef.focus());
</script>

<header>
    <h1>Fridge Poetry</h1>
</header>

<main>
    <p>Your email has been confirmed - almost there!</p>
    <p>Now just enter a display name and pick a color!</p>

    <label for="display-name">Display name:</label>
    <input
        id="display-name"
        type="text"
        bind:value={displayName}
        bind:this={nameRef}
    />
</main>
