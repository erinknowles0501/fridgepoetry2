<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { auth } from "../state.svelte.js";
    import { SvelteURL } from "svelte/reactivity";
    import { addToast } from "../toasts.svelte.js";

    let email = $state("erinknowles@protonmail.com");
    let password = $state("password");
    let confirmPassword = $state("");
    let isSigningUp = $state(false);
    let inviteID = new SvelteURL(window.location).searchParams.get("invite");
    let inviteStatus = new SvelteURL(window.location).searchParams.get(
        "status"
    );
    console.log("inviteID", inviteID, inviteStatus);

    let loginRef;

    function signupValid() {
        if (password !== confirmPassword) {
            addToast("Passwords do not match!");
            return false;
        }

        if (password.length < 10 || password.length > 100) {
            addToast(
                "Password should be at least 10 characters and no more than 100."
            );
            return false;
        }
    }

    function loginValid() {
        if (!password || !email) {
            addToast("Missing email or password");
            return false;
        } else return true;
    }

    async function onsubmit(e) {
        e.preventDefault();

        if (loginValid() === false || (isSigningUp && signupValid() === false))
            return;

        const data = {
            email: email,
            password: password,
        };

        let navigateString = isSigningUp ? "/awaitConfirmSignup" : "/";
        navigateString +=
            inviteID && inviteStatus
                ? `?invite=${inviteID}&status=${inviteStatus}`
                : "";
        console.log("navigateString", navigateString);

        const result = await (
            await fetch(
                import.meta.env.VITE_API_URL +
                    `/auth/${isSigningUp ? "signup" : "login"}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            )
        ).json();

        if (!result.failed) {
            auth.user = result;
            navigate(navigateString, {
                replace: true,
            });
        } else {
            addToast(result.message);
        }
    }

    onMount(async () => {
        loginRef.focus();
        if (inviteID) {
            isSigningUp = true;

            const result = await (
                await fetch(
                    import.meta.env.VITE_API_URL +
                        `/invitations/id/${inviteID}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                )
            ).json();

            if (!result.failed) {
                email = result.to_email;
                console.log("current user", result);
            } else {
                addToast(result.message);
            }
        }
    });
</script>

<header>
    <h1>Fridge Poetry</h1>
</header>

<main>
    {#if inviteID && isSigningUp}
        <div class="message">
            <span class="material-symbols-outlined"> info </span>
            Sign up to accept the invitation :)
        </div>
    {/if}
    <form {onsubmit}>
        <label for="email">Email:</label>
        <input
            id="email"
            type="email"
            bind:value={email}
            bind:this={loginRef}
        />

        <label for="password">Password:</label>
        <input id="password" type="password" bind:value={password} />

        {#if isSigningUp}
            <label for="confirm-password">Confirm Password:</label>
            <input
                id="confirm-password"
                type="password"
                bind:value={confirmPassword}
            />
        {/if}

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
        width: 400px; /* TODO mobile sizing */
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

    .message {
        background: #ddd; /* TODO light-dark */
        padding: 0.5rem;
        margin-bottom: 1rem;
        width: 400px;
    }
</style>
