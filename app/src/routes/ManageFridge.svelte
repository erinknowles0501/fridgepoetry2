<script>
    import { Link, navigate } from "svelte-routing";
    import { onMount } from "svelte";

    let { id } = $props();
    let fridge = $state({});
    let invitations = $state([]);
    let wordList = $state([]);
    let deletingFridgeText = $state("");
    let isDeletingFridge = $state(false);

    let deleteRef;

    onMount(async () => {
        const fridgeResult = await fetch(`http://localhost:3000/fridge/${id}`, {
            credentials: "include",
        });
        fridge = await fridgeResult.json();

        const invitationsResult = await fetch(
            `http://localhost:3000/invitations/fridge/${id}`,
            { credentials: "include" }
        );
        invitations = await invitationsResult.json();

        const wordListResult = await fetch(
            `http://localhost:3000/words/${id}`,
            { credentials: "include" }
        );
        wordList = await wordListResult.json();
    });

    async function deleteFridge() {
        const result = await fetch(`http://localhost:3000/fridge/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (result) navigate("/dashboard", { replace: true });
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
                <input type="email" /><input type="button" value="send" />
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

    <Link to="/dashboard">Back to dashboard</Link>
</div>
