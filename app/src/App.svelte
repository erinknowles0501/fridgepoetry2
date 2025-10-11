<script>
    import { onMount } from "svelte";
    import { Router, Link, Route, navigate } from "svelte-routing";
    import Login from "./routes/Login.svelte";
    import Dashboard from "./routes/Dashboard.svelte";
    import ConfirmSignup from "./routes/ConfirmSignup.svelte";
    import AwaitConfirmSignup from "./routes/AwaitConfirmSignup.svelte";
    import Toasts from "./components/Toasts.svelte";
    import { addToast } from "./toasts.svelte.js";

    import { auth } from "./state.svelte.js";

    onMount(async () => {
        const result = await (
            await fetch("http://localhost:3000/auth/check-session", {
                method: "GET",
                credentials: "include",
            })
        ).json();
        console.log("current user:", result);
        if (!result.failed) {
            if (result.isLoggedIn) {
                auth.user = result.user;
            }
        } else addToast(result.message);
    });
</script>

<div>
    <Toasts />
    <Router>
        <Route path="/awaitConfirmSignup">
            {#if auth.user && auth.user.isVerified == "false"}
                <AwaitConfirmSignup />
            {:else if auth.user && auth.user.isVerified == "true"}
                <Dashboard />
            {:else}
                <Login />
            {/if}
        </Route>
        <Route path="/confirmSignup">
            {#if auth.user && auth.user.isVerified == "true" && !auth.user.displayName}
                <ConfirmSignup />
            {:else if auth.user && auth.user.isVerified == "true" && auth.user.displayName}
                <Dashboard />
            {:else}
                <Login />
            {/if}
        </Route>
        <Route path="/*">
            {#if auth.user && auth.user.isVerified == "true"}
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
