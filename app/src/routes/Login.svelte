<script>
    import { navigate } from "svelte-routing";
    import { user } from "../stores.js";

    let email = $state("erinknowles@protonmail.com");
    let password = $state("password");

    async function onclick() {
        const data = {
            email: email,
            password: password,
        };

        fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                res.json().then((data) => {
                    console.log(data);
                    user.set(data);
                    navigate("/dashboard", { replace: true });
                });
            })
            .catch((e) => console.log(e));
    }
</script>

<form>
    <input type="email" bind:value={email} />
    <input type="password" bind:value={password} />

    <a href="/nowhere">Forgot password?</a>
    <a href="/nowhere">Sign up?</a>
    <button type="button" {onclick}>Login</button>
</form>

<style>
    form {
        width: 200px;
    }

    input {
        width: 100%;
    }
</style>
