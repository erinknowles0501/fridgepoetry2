<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { auth } from "../stores.js";

    let email = $state("erinknowles@protonmail.com");
    let confirmEmail = $state("");
    let password = $state("password");
    let isSigningUp = $state(false);

    let loginRef;

    async function onsubmit(e) {
        e.preventDefault();

        // TODO validation

        const data = {
            email: email,
            password: password,
        };

        fetch(
            `http://localhost:3000/auth/${isSigningUp ? "signup" : "login"}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        )
            .then((res) => {
                res.json().then((data) => {
                    console.log(data);
                    auth.set({ ...auth, user: data });
                    navigate(
                        isSigningUp ? "/awaitConfirmSignup" : "/dashboard",
                        {
                            replace: true,
                        }
                    );
                });
            })
            .catch((e) => console.log(e));
    }

    onMount(() => loginRef.focus());
</script>

<header>
    <h1>Fridge Poetry</h1>
</header>

<main>
    <form {onsubmit}>
        <label for="email">Email:</label>
        <input
            id="email"
            type="email"
            bind:value={email}
            bind:this={loginRef}
        />
        {#if isSigningUp}
            <label for="confirm-email">Confirm Email:</label>
            <input id="confirm-email" type="email" bind:value={confirmEmail} />
        {/if}
        <label for="password">Password:</label>
        <input id="password" type="password" bind:value={password} />

        <div class="form-bottom">
            <input
                type="button"
                class="secondary"
                value="Forgot password?"
                style="margin-left: -0.9em;"
            />
            <div>
                <input
                    type="button"
                    class="secondary"
                    onclick={(e) => {
                        e.preventDefault();
                        isSigningUp = !isSigningUp;
                    }}
                    value={isSigningUp ? "Log in?" : "Sign up?"}
                />
                <button type="submit">
                    {isSigningUp ? "Sign up" : "Log in"}
                </button>
            </div>
        </div>
    </form>
</main>

<style>
    form {
        width: 400px;
    }

    input[type="email"],
    input[type="password"] {
        width: 100%;
    }

    .form-bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-top: 2em;
    }
</style>
