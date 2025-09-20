<script>
    import { Link, navigate } from "svelte-routing";
    import { onMount } from "svelte";

    let { id } = $props();
    let fridge = $state({});
    let invitations = $state([]);
    let wordList = $state([]);

    onMount(async () => {
        const fridgeResult = await fetch(`http://localhost:3000/fridge/${id}`);
        fridge = await fridgeResult.json();

        const invitationsResult = await fetch(
            `http://localhost:3000/invitations/fridge/${id}`
        );
        invitations = await invitationsResult.json();

        const wordListResult = await fetch(`http://localhost:3000/words/${id}`);
        wordList = await wordListResult.json();
    });

    async function deleteFridge() {
        const result = await fetch(`http://localhost:3000/fridge/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (result) navigate("/dashboard", { replace: true });
    }
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
            <input
                type="button"
                color="red"
                onclick={deleteFridge}
                value="Delete!"
            />
        </div>
    {/if}

    <Link to="/dashboard">Back to dashboard</Link>
</div>
