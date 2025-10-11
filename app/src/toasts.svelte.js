let id = $state(0);
export let toasts = $state([]);

export const addToast = (message, type = 'error', duration = 5000) => {
    console.log('error!', message);

    const toast = { id: id++, message, type };
    toasts.push(toast);

    setTimeout(() => {
        const index = toasts.findIndex(t => t.id === toast.id);
        if (index !== -1) toasts.splice(index, 1);
    }, duration);
}
