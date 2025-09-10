<script>
    import { Link } from "svelte-routing";
    import { onMount } from "svelte";

    let { id } = $props();

    let fridge = $state({});

    onMount(async () => {
        const res = await fetch(`http://localhost:3000/fridge/${id}`);
        fridge = await res.json();
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
    {/if}

    <Link to="/dashboard">Back to dashboard</Link>
</div>
