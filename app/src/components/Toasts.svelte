<script>
    import { fade, fly } from "svelte/transition";
    import { toasts } from "../toasts.svelte.js";
</script>

<div class="toast-wrap">
    {#each toasts as toast}
        <div
            class="toast {toast.type == 'error' ? 'error' : ''}"
            in:fly={{ y: 10 }}
            out:fade={{ duration: 200 }}
        >
            <span class="material-symbols-outlined"> error </span>
            {toast.message}
        </div>
    {/each}
</div>

<style>
    .toast-wrap {
        position: fixed;
        top: 1rem;
        right: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        z-index: 999;
    }

    .toast {
        width: 300px;
        background: white; /* TODO light-dark */
        border-left: 6px solid #666;
        padding: 1rem;
        font-size: 0.9rem;
    }

    .error {
        border-left: 6px solid red;
    }
</style>
