<script>
    import { Router, Link, Route, navigate } from "svelte-routing";
    import Welcome from "./Welcome.svelte";
    import ManageFridge from "./ManageFridge.svelte";

    export let url = "/dashboard";
    // export let basepath = "/dashboard";

    async function onclick(e) {
        e.preventDefault();

        fetch("http://localhost:3000/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                res.json().then((data) => {
                    navigate("/login", { replace: true });
                });
            })
            .catch((e) => console.log(e));
    }
</script>

<!-- header component -->

<Router {url}>
    <nav>
        <Link to="/dashboard">Home</Link>
        <a href="/logout" {onclick}>Logout</a>
    </nav>
    <main>
        <Route path="/"><Welcome /></Route>
        <Route path="/manage/:id" let:params>
            <ManageFridge id={params.id} />
        </Route>
        <!-- <Route path="/dashboard"><Dashboard /></Route> -->
        <!-- <Route path="/fridge/id"><Fridge {id} /></Route> -->
    </main>
</Router>
