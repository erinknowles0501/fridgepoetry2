<script>
    import { Router, Link, Route, navigate } from "svelte-routing";
    import { SvelteURL } from "svelte/reactivity";

    import { auth } from "../state.svelte.js";
    import Welcome from "./Welcome.svelte";
    import ManageFridge from "./ManageFridge.svelte";
    import Create from "./Create.svelte";

    let { url } = $props();
    let pathname = $state(getPathname());
    console.log("pathname", pathname);

    function getPathname() {
        return window.location.pathname;
    }

    async function onclick(e) {
        e.preventDefault();

        const result = await (
            await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
        ).json();

        if (!result.failed) {
            auth.user = null;
            navigate("/", { replace: true });
        } else {
            addToast(result.message);
        }
    }
</script>

<header>
    {#if pathname.includes("/manage") || pathname.includes("/create")}
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
