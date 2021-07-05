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
        flex: 1;
    }
</style>
