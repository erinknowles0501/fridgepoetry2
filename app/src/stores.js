import { writable } from 'svelte/store';

export const auth = writable({
    isLoggedIn: false,
    emailVerified: false,
    user: null
});
