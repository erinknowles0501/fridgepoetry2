<script>
    import { Router, Link, Route, navigate } from "svelte-routing";
    import { SvelteURL } from "svelte/reactivity";
    import { get } from "svelte/store";
    // TODO Save user default display name and return it with user when login and use it here

    import Welcome from "./Welcome.svelte";
    import ManageFridge from "./ManageFridge.svelte";
    import Create from "./Create.svelte";

    import { auth } from "../stores.js";

    let { url } = $props();
    let pathname = new SvelteURL(window.location).pathname;

    async function onclick(e) {
        e.preventDefault();

        fetch("http://localhost:3000/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                res.json().then((data) => {
                    navigate("/", { replace: true });
                });
            })
            .catch((e) => console.log(e));
    }
</script>

<header>
    {#if pathname == "/dashboard/manage" || pathname == "/dashboard/create"}
        <Link to="/dashboard">&lt;- Back to main</Link>
    {/if}
    <div class="header-wrap">
        <h1>Fridge Poetry</h1>
        <div class="user-info">
            <div class="welcome">
                Welcome, <b>{get(auth).user.email.split("@")[0]}</b>
            </div>
            <div class="logout"><a href="/" {onclick}>Logout</a></div>
        </div>
    </div>
</header>

<!-- <nav>
    {#if pathname == "/dashboard/manage" || pathname == "/dashboard/create"}
        <Link to="/dashboard">Home</Link>
    {/if}
</nav> -->

<Router {url}>
    <main>
        <Route path="/"><Welcome /></Route>
        <Route path="/manage/:id" let:params>
            <ManageFridge id={params.id} />
        </Route>
        <Route path="/create"><Create /></Route>
        <!-- <Route path="/dashboard"><Dashboard /></Route> -->
        <!-- <Route path="/fridge/id"><Fridge {id} /></Route> -->
    </main>
</Router>
