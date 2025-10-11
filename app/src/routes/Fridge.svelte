<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";

    import Magnet from "../components/Magnet.svelte";

    let { id } = $props();
    let fridge = $state({});
    let words = $state([]);
    let wordEls = $state([]);
    let scale = $state({
        x: 1,
        y: 1,
        isPortrait: false,
    });
    let currentDrag = $state({
        offset: { x: 0, y: 0 },
        el: null,
    });
    let ghostEl;

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
        ghostEl.style.zoom = scale.x;
        ghostEl.style.top = "-100px"; // These magic numbers aren't terribly magic - they're just to hide the element.
        ghostEl.style.left = "-100px";
        ghostEl.style.zIndex = "-20";

        addAppDragListeners();
    });

    function onDragStart(event, element) {
        currentDrag.offset.x = event.offsetX;
        currentDrag.offset.y = event.offsetY;

        ghostEl.textContent = element.textContent;
        event.dataTransfer?.setDragImage(
            ghostEl,
            event.offsetX * scale.x,
            event.offsetY * scale.y
        );
        currentDrag.el = element;
    }

    $effect(() => {
        for (const el of wordEls) {
            el.addEventListener("dragstart", (e) => onDragStart(e, el));
            el.addEventListener("touchstart", (e) => onDragStart(e, el));
        }
    });

    function addAppDragListeners() {
        appRef.addEventListener(
            "dragover",
            (event) => {
                event.preventDefault();
            },
            false
        );
        appRef.addEventListener("touchmove", (event) => {
            if (currentDrag.el) {
                ghostEl.style.zIndex = 20;
                ghostEl.style.top = event.changedTouches[0].pageY + "px";
                ghostEl.style.left = event.changedTouches[0].pageX + "px";
            }
        });

        appRef.addEventListener("drop", onDrop);
        appRef.addEventListener("touchend", (event) => onDrop(event, true));

        function onDrop(event, isTouch = false) {
            if (currentDrag.el) {
                /*
            This function has to take the on-page location of the drop (x and y values up to the pixel width and height of the client's window) and transform it into the "app" location (x and y values up to APP_WIDTH and APP_HEIGHT - the internal coordinate system), taking into account the possible (UI is at side in landscape, top in portrait) offset from the UI element, and the possible (mobile doesn't record this) offset from where the word was clicked vs that word's origin.
            Word-offset is added outside the translation to app location, since it's recorded and applied in on-page location, and has to be cancelled out the same way.

            There are also two factors here: 
            1. Whether the page is portrait or landscape
            2. Whether the browser is desktop or mobile.

            (1) Affects positioning (due to UI position), and gives weird inversions of X and Y because of the rotation of the app element
            (2) Affects how we get the location of the event on the page.
            */

                const pageX = event.pageX || event.changedTouches[0].pageX;
                const pageY = event.pageY || event.changedTouches[0].pageY;

                let adjustedX, adjustedY;

                if (scale.isPortrait) {
                    /* Here, because the app is rotated, we have to translate the on-page Y value into an in-app X value, and vice versa. */
                    adjustedX = pageY / scale.x;
                    adjustedY = APP_HEIGHT - pageX / scale.y;
                } else {
                    adjustedX = pageX / scale.x - currentDrag.offset.x;
                    adjustedY = pageY / scale.y - currentDrag.offset.y;
                }

                adjustedX = Math.round(adjustedX);
                adjustedY = Math.round(adjustedY);

                currentDrag.el.style.top = adjustedY + "px";
                currentDrag.el.style.left = adjustedX + "px";

                // fridgeRepo
                //     .updateWord(
                //         store.currentDrag.el.getAttribute("data-id"),
                //         adjustedY,
                //         adjustedX,
                //         store.fridge.id
                //     )
                //     .then(() => (store.currentDrag.el = null));

                if (isTouch) {
                    ghostEl.style.top = "-100px"; // These magic numbers aren't terribly magic - they're just to hide the element.
                    ghostEl.style.left = "-100px";
                    ghostEl.style.zIndex = "-20";
                }
            }
        }
    }
</script>

<div class="fridge" bind:this={appRef}>
    <Magnet text="h" bind:element={ghostEl} />
    {#each words as word, i}
        <Magnet
            text={word.text}
            position={word.position}
            bind:element={wordEls[i]}
        />
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
