<script>
    import { Link, navigate } from "svelte-routing";
    import { onMount } from "svelte";
    import { auth } from "../state.svelte.js";
    import { addToast } from "../toasts.svelte.js";

    let { id } = $props();
    let fridge = $state({});
    let isOwner = $state(false);
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

        if (fridge.failed) {
            addToast(fridge.message);
            return;
        }

        if (fridge.owner_id == auth.user.id) isOwner = true;

        if (isOwner) await refreshInvitations();

        const wordListResult = await (
            await fetch(`http://localhost:3000/words/${id}`, {
                credentials: "include",
            })
        ).json();
        if (wordListResult.failed) {
            addToast(wordListResult.message);
            return;
        }
        wordList = await wordListResult;
    });

    const refreshInvitations = async () => {
        const result = await (
            await fetch(`http://localhost:3000/invitations/fridge/${id}`, {
                credentials: "include",
            })
        ).json();
        if (!result.failed) invitations = result;
        else addToast(result.message);
    };

    async function deleteFridge() {
        const result = await (
            await fetch(`http://localhost:3000/fridge/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
        ).json();
        if (!result.failed) navigate("/", { replace: true });
        else addToast(result.message);
    }

    async function sendInvite() {
        const data = {
            fromID: auth.user.id,
            toEmail: newInviteEmail,
            fridgeID: id,
        };

        const result = await (
            await fetch(`http://localhost:3000/invitations/send`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
        ).json();

        if (!result.failed) {
            await refreshInvitations();
        } else {
            addToast(result.message);
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

        {#if isOwner}
            <div>
                <h3>Invitations</h3>

                <div class="invitations-wrap">
                    {#each invitations as invitation}
                        <div
                            class="invitation {invitation.status.toLowerCase()}"
                        >
                            <p class="invite-to">{invitation.to}</p>
                            <p class="sent-on">{invitation.createdAt}</p>
                            <p class="status">{invitation.status}</p>
                            {#if invitation.status == "PENDING"}<a href="/">
                                    Revoke
                                </a>{/if}
                        </div>
                    {/each}
                </div>

                <div>
                    <input type="email" bind:value={newInviteEmail} /><input
                        type="button"
                        value="send"
                        onclick={() => sendInvite()}
                    />
                </div>
            </div>
        {/if}

        <div>
            <h3>Word list</h3>
            {wordList.map((word) => word.text)}
        </div>

        {#if isOwner}
            <div>
                {#if !isDeletingFridge}
                    <input
                        type="button"
                        font-color="red"
                        onclick={() => (isDeletingFridge = true)}
                        value="Delete fridge?"
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
    {/if}

    <Link to="/">Back to dashboard</Link>
</div>

<style>
    .invitations-wrap {
        display: grid;
        min-width: 300px;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .invitation {
        font-size: 0.8rem;
        border: 3px solid var(--bordercolor);
        padding: 0.7rem;
    }

    .invitation p {
        padding: 0;
        margin: 0;
    }

    .invitation .invite-to {
        font-weight: 500;
    }

    .invitation .status {
        font-weight: 600;
        font-size: 0.6rem;
        padding: 0.2rem;
        display: inline-block;
        background: rgba(0, 0, 0, 0.1);
    }

    .invitation.pending {
        border: 3px dashed var(--lightbordercolor);
        color: var(--lighttextcolor);
    }

    .invitation.declined {
        background: var(--lightbordercolor);
        border: 3px dashed var(--bordercolor);
        color: var(--lighttextcolor);
    }
</style>
