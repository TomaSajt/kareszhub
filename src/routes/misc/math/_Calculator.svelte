<script context="module" lang="ts">
    declare let Desmos
</script>

<script lang="ts">
    import { onMount } from "svelte";
    export let width = 700;
    export let height = 400;
    export let expressions: any[] = [];
    let div: HTMLDivElement;

    onMount(() => {
        let calculator = Desmos.GraphingCalculator(div, {
            keypad: false,
            expressionsTopbar: false,
            settingsMenu: false,
            zoomButtons: false
        });
        calculator.setExpressions(expressions);
    });
</script>
<div id="calculator" style="width: {width}px;height: {height}px;" bind:this={div} />

<style lang="scss">
    #calculator {
        margin: 20px 0;
    }
</style>
