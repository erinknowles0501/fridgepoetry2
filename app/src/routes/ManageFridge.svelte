<script>
    import { Link, navigate } from "svelte-routing";
    import { onMount } from "svelte";
    import { auth } from "../state.svelte.js";

    let { id } = $props();
    let fridge = $state({});
    let invitations = $state([]);
    let newInviteEmail = $state("colorandcontrast@gmail.com");
    let wordList = $state([]);
    let deletingFridgeText = $state("");
    let isDeletingFridge = $state(false);

    let deleteRef;

    onMount(async () => {
        const fridgeResult = await fetch(`http://localhost:3000/fridge/${id}`, {
            credentials: "include",
        });
        fridge = await fridgeResult.json();

        await refreshInvitations();

        const wordListResult = await fetch(
            `http://localhost:3000/words/${id}`,
            { credentials: "include" }
        );
        wordList = await wordListResult.json();
    });

    const refreshInvitations = async () => {
        const result = await fetch(
            `http://localhost:3000/invitations/fridge/${id}`,
            {
                credentials: "include",
            }
        );
        invitations = await result.json();
    };

    async function deleteFridge() {
        const result = await fetch(`http://localhost:3000/fridge/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (result) navigate("/", { replace: true });
    }

    async function sendInvite() {
        const data = {
            fromID: auth.user.id,
            toEmail: newInviteEmail,
            fridgeID: id,
        };

        console.log("data", data);

        const result = await fetch(`http://localhost:3000/invitations/send`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (result) {
            await refreshInvitations();
        }
    }

    $effect(() => {
        if (isDeletingFridge == true) {
            deletingFridgeText = "";
            deleteRef.focus();
        }
    });

    $effect(() => {
        if (deletingFridgeText === "delete") deleteFridge();
    });
</script>

<div>
    <p>Manage Fridge {id}!</p>

    {#if fridge.name}
        <div>
            {fridge.name} <br />
            {fridge.id}<br />
            {fridge.lastChanged}
        </div>

        <div>
            <h3>Invitations</h3>
            {#each invitations as invitation}
                {#if invitation.status == "PENDING"}
                    <div>{invitation.to}</div>
                {/if}
            {/each}
            <div>
                <input type="email" bind:value={newInviteEmail} /><input
                    type="button"
                    value="send"
                    onclick={() => sendInvite()}
                />
            </div>
        </div>

        <div>
            <h3>Word list</h3>
            {wordList.map((word) => word.text)}
        </div>

        <div>
            {#if !isDeletingFridge}
                <input
                    type="button"
                    font-color="red"
                    onclick={() => (isDeletingFridge = true)}
                    value="Delete?"
                />
            {:else}
                <p>Type 'delete' to delete.</p>
                <input
                    type="text"
                    font-color="red"
                    bind:value={deletingFridgeText}
                    bind:this={deleteRef}
                />
            {/if}
        </div>
    {/if}

    <Link to="/">Back to dashboard</Link>
</div>
