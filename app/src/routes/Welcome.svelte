<script>
    import { Link } from "svelte-routing";

    const fridges = [
        { name: "Fam fridge", id: 1, lastChanged: "20250821" },
        { name: "Invited fridge", id: 2, lastChanged: "20250824" },
    ];
</script>

<div>
    Welcome!

    {#each fridges as fridge}
        <div>
            <Link to="/dashboard/manage/{fridge.id}">{fridge.name}</Link>
        </div>
    {/each}
</div>
