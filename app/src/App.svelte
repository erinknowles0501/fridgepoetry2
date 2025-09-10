<script>
    import { Router, Link, Route } from "svelte-routing";
    import Login from "./routes/Login.svelte";
    import Dashboard from "./routes/Dashboard.svelte";

    export let url = "/login";
</script>

<main>
    <h1>Fridge Poetry</h1>

    <!-- <div class="card">
        <Login />
    </div> -->

    <Router {url}>
        <!-- <nav>
            <Link to="/">Home</Link>
            <Link to="/login">About</Link>
        </nav> -->
        <div>
            <Route path="/login"><Login /></Route>
            <Route path="/dashboard/*"><Dashboard /></Route>
            <!-- <Route path="/fridge/id"><Fridge {id} /></Route> -->
        </div>
    </Router>
</main>

<style>
</style>
