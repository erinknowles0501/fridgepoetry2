<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { user } from "../stores.js";
    import { get } from "svelte/store";

    let fridges = $state([]);
    let currentUser = get(user);

    onMount(async () => {
        const fridgesResult = await fetch(
            `http://localhost:3000/fridges/list/${currentUser.id}`
        );
        fridges = await fridgesResult.json();
    });
</script>

<div>
    Welcome!<br /><br />

    <Link to="/dashboard/create">Create fridge</Link>
    <br /><br />

    {#each fridges as fridge}
        <div>
            <Link to="/dashboard/manage/{fridge.id}">{fridge.name}</Link>
        </div>
    {/each}
</div>
