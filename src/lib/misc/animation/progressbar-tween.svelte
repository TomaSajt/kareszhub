<script lang="ts">
    import { quintOut, cubicOut } from "svelte/easing";
    import { crossfade } from "svelte/transition";
    import { tweened } from "svelte/motion";
    const progress = tweened(0, {
        duration: 600,
        easing: cubicOut,
    });

    const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 200),
        fallback: (node, params) => {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;
            return {
                duration: 600,
                easing: quintOut,
                css: (t) => `
                    transform: ${transform} scale(${t});
                    opacity: ${t};
                `,
            };
        },
    });
</script>

{$progress*100}%
<progress value={$progress} />

<button on:click={() => progress.set(0)}> 0% </button>

<button on:click={() => progress.set(0.25)}> 25% </button>

<button on:click={() => progress.set(0.5)}> 50% </button>

<button on:click={() => progress.set(0.75)}> 75% </button>

<button on:click={() => progress.set(1)}> 100% </button>

<style lang="scss">
    progress {
        display: block;
        width: 100%;
    }
</style>
