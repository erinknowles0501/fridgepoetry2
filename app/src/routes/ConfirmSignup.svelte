<script>
    import { navigate } from "svelte-routing";
    import { auth } from "../state.svelte.js";
    import SetNameAndColor from "../components/SetNameAndColor.svelte";

    auth.emailVerified = true;

    let displayName = $state("");
    let currentColor = $state(0);
    let password = $state("");

    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const userID = params.get("user");

    function submit() {
        const data = {
            displayName,
            color: currentColor,
            email,
            password,
        };

        console.log("data", data);

        fetch(`http://localhost:3000/user/${userID}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async (result) => {
            const user = await result.json();
            auth.user = user;
            navigate("/", { replace: true });
        });
    }
</script>

<header>
    <h1>Fridge Poetry</h1>
</header>

<main>
    <p>Your email has been confirmed - almost there!</p>
    <p>
        Now just enter a default display name and pick a default color! Later,
        when you create and join fridges, you can pick what name and color to
        use on them individually, if you like.
    </p>

    <SetNameAndColor bind:displayName bind:currentColor />

    <label for="password">Re-enter your password:</label>
    <input type="password" id="password" bind:value={password} />

    <br /><br />

    <input type="button" onclick={submit} value="Continue to your dashboard!" />
</main>
