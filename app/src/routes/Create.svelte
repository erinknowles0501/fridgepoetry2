<script>
    import { auth } from "../state.svelte.js";
    import { addToast } from "../toasts.svelte.js";
    import { navigate } from "svelte-routing";

    import defaultWords from "../../defaultWords.json";
    // TODO word sets
    // TODO word chips

    let fridgeName = $state("New fridge name");
    let emailToAdd = $state("");
    let emails = $state(["eee@eee.com", "sdfsdf@sdfsdf.com"]);

    let words = $state(defaultWords.toString());
    let wordsArray = $derived(
        words
            .split(",")
            .map((w) => w.trim())
            .filter((w) => w.length > 0)
    );

    function addEmail() {
        // This is really permissive, but that's fine for the frontend for now.
        if (!emailToAdd.includes("@") || !emailToAdd.includes(".")) {
            addToast("Invalid email address syntax.");
            return;
        }
        if (
            emails
                .map((e) => e.toLowerCase())
                .includes(emailToAdd.toLowerCase())
        ) {
            addToast("This email is already in the invitation list.");
            return;
        }
        if (emailToAdd == auth.user.email) {
            addToast("Cannot invite yourself.");
            return;
        }

        emails.push(emailToAdd);
        emailToAdd = "";
    }

    function removeEmail(email) {
        emails = emails.filter((e) => e != email);
    }

    function valid() {
        if (!fridgeName) {
            addToast("Missing fridge name.");
            return false;
        }
        if (!words.length || !wordsArray.length) {
            addToast("Missing words.");
            return false;
        }
        return true;
    }

    async function createFridge() {
        if (valid() === false) return;

        const data = {
            ownerID: auth.user.id,
            name: fridgeName,
            wordList: wordsArray,
            invitees: emails.map((e) => e.trim()),
        };

        const result = await fetch(import.meta.env.VITE_API_URL + `/fridge`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!result.failed) navigate("/", { replace: true });
        else addToast(result.message);
    }
</script>

<div>
    <h1>Create</h1>

    <div>
        <h2>New fridge's name</h2>
        <input type="text" bind:value={fridgeName} />
    </div>

    <div>
        <h2>People to invite on launch</h2>
        {#each emails as email}
            <div>
                <p>{email}</p>
                <input
                    type="button"
                    value="remove"
                    onclick={() => removeEmail(email)}
                />
            </div>{/each}
        <input type="email" bind:value={emailToAdd} />
        <input type="button" value="add" onclick={addEmail} />
    </div>

    <div>
        <h2>Word list</h2>

        <textarea bind:value={words}> </textarea>
    </div>

    <div><input type="button" value="Create" onclick={createFridge} /></div>
</div>
