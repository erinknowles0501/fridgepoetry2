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

    async function onsubmit(e) {
        e.preventDefault();

        // TODO validation
        if (isSigningUp && password != confirmPassword) {
            addToast("Passwords do not match!");
            return;
        }

        const data = {
            email: email,
            password: password,
        };

        // if (inviteID && isSigningUp) data.invite = inviteID;

        let navigateString = isSigningUp ? "/awaitConfirmSignup" : "/";
        navigateString +=
            inviteID && inviteStatus
                ? `?invite=${inviteID}&status=${inviteStatus}`
                : "";
        console.log("navigateString", navigateString);

        const result = await (
            await fetch(
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
                    `http://localhost:3000/invitations/id/${inviteID}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                )
            ).json();

            if (!result.failed) {
                email = data.to_email;
                console.log("current user", data);
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
