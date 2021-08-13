<script lang="ts">
    import Minesweeper from "./Minesweeper/_Minesweeper.svelte";
</script>

<svelte:head>
    <title>Minesweeper</title>
</svelte:head>
<div id="wrapper">
    <Minesweeper height={9} width={9} mines={10} />
</div>

<style lang="scss">
    #wrapper {
        display: grid;
        place-items: center;
        margin-top: 30px;
    }
</style>
