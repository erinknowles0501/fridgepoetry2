<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { auth } from "../state.svelte.js";

    let fridges = $state([]);
    let currentUser = auth.user;

    onMount(async () => {
        const fridgesResult = await fetch(
            `http://localhost:3000/fridges/list/${currentUser.id}`,
            { credentials: "include" }
        );
        fridges = await fridgesResult.json();
    });
</script>

<div class="title-wrap">
    <h2>My fridges</h2>
    <Link to="/create">Create fridge...</Link>
</div>

<div class="card-grid">
    {#each fridges as fridge}
        <div class="card">
            <div class="details">
                <h3>{fridge.name}</h3>
                <div>Last changed</div>
            </div>
            <div class="card-action-wrap">
                <Link to="/manage/{fridge.id}">Manage</Link>
                <Link to="/fridge/{fridge.id}">Go to fridge</Link>
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
</style>
