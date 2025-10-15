<script>
    import { auth } from "../state.svelte.js";
    import { addToast } from "../toasts.svelte.js";
    import { navigate } from "svelte-routing";

    import defaultWords from "../../defaultWords.json";
    // TODO word sets

    let fridgeName = $state("New fridge name");
    let emailToAdd = $state("");
    let emails = $state(["eee", "sdfsdf"]);

    let words = $state(defaultWords.toString());

    function addEmail() {
        emails.push(emailToAdd);
        emailToAdd = "";
    }

    function removeEmail(email) {
        emails = emails.filter((e) => e != email);
    }

    async function createFridge() {
        const data = {
            ownerID: auth.user.id,
            name: fridgeName,
            wordList: words.split(",").map((w) => w.trim()),
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
