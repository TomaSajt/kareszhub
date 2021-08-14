<script lang="ts">
    import Calculator from "./_Calculator.svelte";
    import MathContext from "./_MathContext.svelte";
    function r(template: TemplateStringsArray, ...substitutions: any[]) {
        return String.raw(template, substitutions);
    }
</script>

<svelte:head>
    <title>Integrals</title>
</svelte:head>

<MathContext let:desmosLoaded>
    <h1>Integrals</h1>
    <p>
        Let's suppose we have a function \(f(x)\). Our goal is to find the area
        under \(f(x)\) between \(x=a\) and \(x=b\). This might sound really hard
        to compute for any \(f(x)\), but we can take a look at some functions
        for which it is easy to compute.
    </p>
    <p>
        In our first example we have \(f(x)=x\), \(a=1\) and \(b=3\). Computing the area isn't that difficult because we have a trapezoid.
        Recall that the area of a trapezoid is $$ A = &lcub; h(s_1+s_2) \over 2
        &rcub; $$ where \(h\) is the height, and \(s_1\) and \(s_2\) are the
        parallel sides. In this example $$h=b-a=2$$ $$s_1=f(a)=1$$
        $$s_2=f(b)=3$$, therefore $$ A = &lcub; 2(1+3)\over 2 &rcub; = 4 $$
    </p>

    {#if desmosLoaded}
        <Calculator
            expressions={[
                {
                    latex: r`f\left(x\right)=x`,
                },
                {
                    latex: r`a=1`,
                },
                {
                    latex: r`b=3`,
                },
                {
                    latex: r`0\le y\le f\left(x\right)\left\{a\le x\le b\right\}`,
                    color: "#388c46",
                },
                {
                    latex: r`f\left(x\right)\le y\le0\left\{a\le x\le b\right\}`,
                    color: "#c74440",
                },
            ]}
        />
    {/if}
    <p>This part is not done yet ;)</p>
    {#if desmosLoaded}
        <Calculator
            expressions={[
                {
                    latex: String.raw`f\left(x\right)=\frac{1}{2}x^{3}-2x^{2}+2x+1`,
                },
                {
                    latex: r`a=1`,
                },
                {
                    latex: r`b=3`,
                },
                {
                    latex: r`0\le y\le f\left(x\right)\left\{a\le x\le b\right\}`,
                    color: "#388c46",
                },
                {
                    latex: r`f\left(x\right)\le y\le0\left\{a\le x\le b\right\}`,
                    color: "#c74440",
                },
            ]}
        />
    {/if}
</MathContext>

<style lang="scss">
</style>
