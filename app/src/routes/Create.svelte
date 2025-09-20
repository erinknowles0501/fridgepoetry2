<script>
    import { get } from "svelte/store";
    import { user } from "../stores.js";
    import { navigate } from "svelte-routing";

    let fridgeName = $state("New fridge name");
    let emailToAdd = $state("");
    let emails = $state(["eee", "sdfsdf"]);
    let words = $state(
        "Big,Yes,Limnal,Butt,Piranha,Keyboard,Force,Banana,Ghost,Reed,Spectral,Helicopter,Enormous,And,I"
    );

    function addEmail() {
        emails.push(emailToAdd);
        emailToAdd = "";
    }

    function removeEmail(email) {
        emails = emails.filter((e) => e != email);
    }

    async function createFridge() {
        const data = {
            ownerID: get(user).id,
            name: $state.snapshot(fridgeName),
            wordList: $state.snapshot(words).split(","),
            invitees: $state.snapshot(emails),
        };

        const result = await fetch(`http://localhost:3000/fridge`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        navigate("/dashboard", { replace: true });
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
