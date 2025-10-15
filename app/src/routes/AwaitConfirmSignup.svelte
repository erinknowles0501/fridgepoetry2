<script>
    import Magnet from "../components/Magnet.svelte";
    import { auth } from "../state.svelte.js";
</script>

<header>
    <h1>Fridge Poetry</h1>
</header>

<main>
    <Magnet text="Almost" />
    <Magnet text="ready" />
    <Magnet text="...!" />

    <p>
        An email has been sent to <b>{auth.user.email}</b> with a link to click to
        confirm your email so you can finish signing up.
    </p>
    <p>You may close this page.</p>
</main>
