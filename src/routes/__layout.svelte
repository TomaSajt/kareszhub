<script lang="ts">
    import Header from "../libs/Header.svelte";
    import Footer from "../libs/Footer.svelte";
</script>

<Header />
<main>
    <slot />
</main>
<Footer />

<style lang="scss">
    main {
        position: relative;;
        flex: 1;
    }
    :global(.italic) {
        font-style: italic;
    }
    :global(.fix-width) {
        max-width: 1000px;
        margin: auto !important;
        background-color: #f7f7f7;
        padding: 20px;
    }
    * {
        box-sizing: border-box;
    }
    :global(body > div) {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    :global(body) {
        margin: 0;
        font-family: "Noto Sans JP";
    }
</style>
