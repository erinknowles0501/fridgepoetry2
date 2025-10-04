<script>
    import { Router, Link, Route, navigate } from "svelte-routing";
    import { SvelteURL } from "svelte/reactivity";

    import { auth } from "../state.svelte.js";
    // TODO Save user default display name and return it with user when login and use it here
    import Welcome from "./Welcome.svelte";
    import ManageFridge from "./ManageFridge.svelte";
    import Create from "./Create.svelte";

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
                    auth.user = null;
                    navigate("/", { replace: true });
                });
            })
            .catch((e) => console.log(e));
    }
</script>

<header>
    {#if pathname == "/manage" || pathname == "/create"}
        <Link to="/">&lt;- Back to main</Link>
    {/if}
    <div class="header-wrap">
        <h1>Fridge Poetry</h1>
        <div class="user-info">
            <div class="welcome">
                Welcome, <b>{auth.user?.displayName}</b>
            </div>
            <div class="logout"><a href="/" {onclick}>Logout</a></div>
        </div>
    </div>
</header>

<!-- <nav>
    {#if pathname == "/manage" || pathname == "/create"}
        <Link to="/">Home</Link>
    {/if}
</nav> -->

<Router {url}>
    <main>
        <Route path="/"><Welcome /></Route>
        <Route path="/manage/:id" let:params>
            <ManageFridge id={params.id} />
        </Route>
        <Route path="/create"><Create /></Route>
        <!-- <Route path="/"><Dashboard /></Route> -->
        <!-- <Route path="/fridge/id"><Fridge {id} /></Route> -->
    </main>
</Router>
