<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { auth } from "../state.svelte.js";
    import { addToast } from "../toasts.svelte.js";
    import { DateTime } from "luxon";

    let fridges = $state([]);
    let currentUser = auth.user;

    onMount(async () => {
        await refreshFridges();
    });

    async function refreshFridges() {
        const fridgesResult = await (
            await fetch(
                import.meta.env.VITE_API_URL +
                    `/fridges/list/${currentUser.id}`,
                { credentials: "include" }
            )
        ).json();
        if (!fridgesResult.failed) fridges = fridgesResult;
        else addToast(fridgesResult.message);
    }

    async function setInvite(status, inviteID) {
        const result = await (
            await fetch(
                import.meta.env.VITE_API_URL +
                    `/invitations/${status}/${inviteID}`,
                { credentials: "include" }
            )
        ).json();
        if (!result.failed) await refreshFridges();
        else addToast(result.message);
    }

    function formatDate(date) {
        return DateTime.fromISO(date).toRelative();
    }
</script>

<div class="title-wrap">
    <h2>My fridges</h2>
    <Link to="/create">Create fridge...</Link>
</div>

<div class="card-grid">
    {#each fridges as fridge}
        <div class="fridge card {fridge.status == 'PENDING' ? 'pending' : ''}">
            <div class="details">
                <h3>{fridge.name}</h3>
                <div class="last-changed">
                    {#if fridge.status == "PENDING"}
                        Sent <b>{formatDate(fridge.created_at)}</b>
                    {:else}
                        Last changed <b>{formatDate(fridge.last_changed)}</b>
                    {/if}
                </div>
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
    .card.fridge {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .card.fridge h3 {
        font-size: 1.05rem;
        line-height: 1.05rem;
    }

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

    .last-changed {
        font-size: 0.7rem;
    }
</style>
