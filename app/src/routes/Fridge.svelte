<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";

    import Magnet from "../components/Magnet.svelte";

    let { id } = $props();
    let fridge = $state({});
    let words = $state([]);
    let scale = $state({
        x: 1,
        y: 1,
        isPortrait: false,
    });
    let currentDrag = $state({});

    const APP_WIDTH = 600;
    const APP_HEIGHT = 400;

    let appRef;
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    console.log("clientWidth, clientHeight", clientWidth, clientHeight);

    onMount(async () => {
        const fridgeResult = await (
            await fetch(`http://localhost:3000/fridge/${id}`, {
                method: "GET",
                credentials: "include",
            })
        ).json();

        console.log("fridge", fridgeResult);
        if (!fridgeResult.failed) {
            fridge = fridgeResult;
        } else addToast(fridgeResult.message);

        const wordsResult = await (
            await fetch(`http://localhost:3000/words/${id}`, {
                method: "GET",
                credentials: "include",
            })
        ).json();

        console.log("words", wordsResult);
        if (!wordsResult.failed) {
            words = wordsResult;
        } else addToast(wordsResult.message);

        ///

        if (clientHeight <= clientWidth) {
            // is landscape
            scale.x = clientWidth / APP_WIDTH;
            scale.y = clientHeight / APP_HEIGHT;
            console.log("scale", scale);

            scale.isPortrait = false;

            appRef.style.rotate = "0deg";
            appRef.style.translate = "0px";
        } else {
            // is portrait
            scale.x = clientHeight / APP_WIDTH;
            scale.y = clientWidth / APP_HEIGHT;
            scale.isPortrait = true;

            appRef.style.rotate = "90deg";
            appRef.style.translate = clientWidth + "px";
        }

        appRef.style.scale = scale.x + " " + scale.y;
    });
</script>

<div class="fridge" bind:this={appRef}>
    Beep <Magnet text="original inline test :)" /> Bop
    {#each words as word}
        <Magnet text={word.text} position={word.position} />
    {/each}
</div>

<footer>
    <Link to="/">&lt; Back to dashboard</Link>
    <b>{fridge.name}</b>
</footer>

<style>
    .fridge {
        position: absolute;
        top: 0;
        left: 0;
        height: 400px;
        width: 600px;
        overflow: hidden;
        transform-origin: top left;
    }

    .fridge :global(div) {
        font-size: 0.5rem;
        padding: 0.1rem 0.3rem;
        border-right: 2px solid grey;
        border-bottom: 2px solid grey;
    }

    footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 0.3rem 1.5rem;
        background: #bbb; /* TODO light-dark */
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: rgba(0, 0, 0, 0.5);
    }

    footer a {
        color: rgba(0, 0, 0, 0.5);
        font-weight: 600;
        text-decoration: none;
    }

    footer a:hover {
        text-decoration: underline;
    }
</style>
