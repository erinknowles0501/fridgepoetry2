<script>
    import { Router, Link, Route } from "svelte-routing";
    import Login from "./routes/Login.svelte";
    import Dashboard from "./routes/Dashboard.svelte";
    import ConfirmSignup from "./routes/ConfirmSignup.svelte";
    import AwaitConfirmSignup from "./routes/AwaitConfirmSignup.svelte";
</script>

<div>
    <Router>
        <!-- <nav>
            <Link to="/">Home</Link>
            <Link to="/login">About</Link>
        </nav> -->
        <Route path="/"><Login /></Route>
        <Route path="/awaitConfirmSignup"><AwaitConfirmSignup /></Route>
        <Route path="/confirmSignup"><ConfirmSignup /></Route>
        <Route path="/dashboard/*"><Dashboard /></Route>
        <Route path="*">
            <p>Route not found</p>
        </Route>
        <!-- <Route path="/fridge/id"><Fridge {id} /></Route> -->
    </Router>
</div>

<style>
</style>
