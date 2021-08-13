<script lang="ts">
    import Chess from "./Chess/_Chess.svelte";
</script>

<svelte:head>
    <title>Chess</title>
</svelte:head>
<div id="wrapper">
    <Chess/>
</div>

<style lang="scss">
    #wrapper {
        width: fit-content;
        margin: auto;
        margin-top: 30px;
    }
</style>
