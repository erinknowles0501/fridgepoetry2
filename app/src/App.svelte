<script>
    import { onMount } from "svelte";
    import { Router, Link, Route, navigate } from "svelte-routing";
    import Login from "./routes/Login.svelte";
    import Dashboard from "./routes/Dashboard.svelte";
    import ConfirmSignup from "./routes/ConfirmSignup.svelte";
    import AwaitConfirmSignup from "./routes/AwaitConfirmSignup.svelte";

    import { auth } from "./state.svelte.js";

    onMount(async () => {
        const result = await (
            await fetch("http://localhost:3000/auth/check-session", {
                method: "GET",
                credentials: "include",
            })
        ).json();
        console.log("result", result);
        if (result.isLoggedIn) {
            auth.user = result.user;
        }
    });
</script>

<div>
    <Router>
        <Route path="/awaitConfirmSignup"><AwaitConfirmSignup /></Route>
        <Route path="/confirmSignup"><ConfirmSignup /></Route>
        <Route path="/*">
            {#if auth.user}
                <Dashboard />
            {:else}
                <Login />
            {/if}
        </Route>
        <Route path="*">
            <p>Route not found</p>
        </Route>
        <!-- <Route path="/fridge/id"><Fridge {id} /></Route> -->
    </Router>
</div>

<style>
</style>
