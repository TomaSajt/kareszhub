<script lang="ts">
    import MathContext from "./_MathContext.svelte";
</script>

<svelte:head>
    <title>The math lab</title>
</svelte:head>
<MathContext>
    <h1>Welcome</h1>
    <p>
        I am completely and absolutely not a trained teacher, so stfu if I'm
        wrong or don't understand something
    </p>
    <p>
        I am doing this project to strengthen my understanding in those topic
        that I'm writing about
    </p>
    <p>
        I will be using MathJax, so I can write fancy math texts, like this: $$x
        = &lcub; -b \pm \sqrt &lcub; b^2-4ac &rcub; \over 2a &rcub; $$
    </p>
    <h2>Topics</h2>
    <ul>
        <a href="./trigonometry"><li>Trigonometry</li></a>
        <a href="./derivatives"><li>Derivatives</li></a>
        <a href="./integrals"><li>Integrals</li></a>
    </ul>
</MathContext>

<style lang="scss">
</style>
