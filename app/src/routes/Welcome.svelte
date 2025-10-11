<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { auth } from "../state.svelte.js";
    import { addToast } from "../toasts.svelte.js";

    let fridges = $state([]); // TODO sort by pending invites first, then lastChanged
    let currentUser = auth.user;

    onMount(async () => {
        await refreshFridges();
    });

    async function refreshFridges() {
        const fridgesResult = await (
            await fetch(
                `http://localhost:3000/fridges/list/${currentUser.id}`,
                { credentials: "include" }
            )
        ).json();
        if (!fridgesResult.failed) fridges = fridgesResult;
        else addToast(fridgesResult.message);
    }

    async function setInvite(status, inviteID) {
        const result = await (
            await fetch(
                `http://localhost:3000/invitations/${status}/${inviteID}`,
                { credentials: "include" }
            )
        ).json();
        if (!result.failed) await refreshFridges();
        else addToast(result.message);
    }
</script>

<div class="title-wrap">
    <h2>My fridges</h2>
    <Link to="/create">Create fridge...</Link>
</div>

<div class="card-grid">
    {#each fridges as fridge}
        <div class="card {fridge.status == 'PENDING' ? 'pending' : ''}">
            <div class="details">
                <h3>{fridge.name}</h3>
                <div>Last changed</div>
            </div>
            <div
                class="card-action-wrap {fridge.status == 'PENDING'
                    ? 'pending'
                    : ''}"
            >
                {#if !fridge.status || fridge.status == "ACCEPTED"}
                    <Link to="/manage/{fridge.id}">Manage</Link>
                    <Link to="/fridge/{fridge.id}">Go to fridge</Link>
                {:else}
                    <a
                        href="/"
                        onclick={() => setInvite("accept", fridge.invite_id)}
                    >
                        Accept
                    </a>
                    <a
                        href="/"
                        onclick={() => setInvite("decline", fridge.invite_id)}
                    >
                        Decline
                    </a>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style>
    .title-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: baseline;
    }

    .title-wrap h2 {
        padding-right: 1.7rem;
    }

    .card.pending {
        border: 3px dashed var(--lightbordercolor);
        color: var(--lighttextcolor);
    }

    .card-action-wrap.pending {
        border-top: 3px dashed var(--lightbordercolor);
    }
</style>
