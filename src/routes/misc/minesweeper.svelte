<script lang="ts">
    import Minesweeper from "../../libs/pages/misc/Minesweeper.svelte";
    let a = 9;
</script>

<svelte:head>
    <title>Minesweeper</title>
</svelte:head>
<div id="wrapper">
    <Minesweeper height={a} width={a} mines={10} />
    <button on:click={() => a++}>asd</button>
</div>

<style lang="scss">
    #wrapper {
        width: fit-content;
        margin: auto;
        margin-top: 30px;
    }
</style>
