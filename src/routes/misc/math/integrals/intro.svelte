<script lang="ts">
    import Calculator from "../_Calculator.svelte";
    import MathContext from "../_MathContext.svelte";
    function r(template: TemplateStringsArray, ...substitutions: any[]) {
        return String.raw(template, substitutions);
    }
</script>

<svelte:head>
    <title>Integrals - Intro</title>
</svelte:head>

<MathContext let:desmosLoaded>
    <h1>Integrals - Intro</h1>
    <p>
        Let's suppose we have a function \(f(x)\). Our goal is to find the area
        under \(f(x)\) between \(x=a\) and \(x=b\). This might sound really hard
        to compute for any \(f(x)\), but we can take a look at some functions
        for which it is easy to compute.
    </p>
    <p>
        In our first example we have \(f(x)=x\), \(a=1\) and \(b=3\). Computing
        the area isn't that difficult because we have a trapezoid. Recall that
        the area of a trapezoid is
    </p>
    $$ A = &lcub; h\cdot(s_1+s_2) \over 2 &rcub; $$
    <p>
        where \(h\) is the height, and \(s_1\) and \(s_2\) are the parallel
        sides. In this example
    </p>
    $$h=3-1=2$$ $$s_1=1$$ $$s_2=3$$
    <p>therefore</p>
    $$ A = &lcub; 2(1+3)\over 2 &rcub; = 4 $$

    {#if desmosLoaded}
        <Calculator
            expressions={[
                {
                    latex: r`f\left(x\right)=x`,
                },
                {
                    latex: r`A=\frac{\left(b-a\right)\left(a+b\right)}{2}`,
                },
                {
                    latex: r`a=1`,
                    sliderBounds: {
                        min: "1",
                        max: "1",
                        step: "",
                    },
                },
                {
                    latex: r`b=3`,
                    sliderBounds: {
                        min: "3",
                        max: "3",
                        step: "",
                    },
                },
                {
                    latex: r`0\le y\le f\left(x\right)\left\{a\le x\le b\right\}`,
                    color: "#388c46",
                    secret: true,
                },
                {
                    latex: r`f\left(x\right)\le y\le0\left\{a\le x\le b\right\}`,
                    color: "#c74440",
                    secret: true,
                },
            ]}
        />
    {/if}
    <p>
        We can generalise the previous example for all functions in the form
        \(f(x)=cx+d\) between \(x=a\) and \(x=b\).
    </p>
    <p>
        Firstly, we notice that the area is still a trapezoid. All we need to
        compute the area is to know \(h\), \(s_1\) and \(s_2\).
    </p>
    <p>
        The parallel sides' lengths are just the values of the function at that
        point, so we have
    </p>
    $$s_1=f(a)=ca+d$$ $$s_2=f(b)=cb+d$$
    <p>The height of the trapezoid is just</p>
    $$h=b-a$$
    <p>Plugging it into the area equation we get</p>
    $$ A = &lcub; h\cdot(s_1+s_2) \over 2 &rcub; $$ $$ = &lcub; (b-a)(ca+d+cb+d)
    \over 2 &rcub; $$
    <p>Factoring out \(c\) and combining the 2 \(d\)s</p>
    $$ = &lcub; (b-a)(c\cdot(a+b)+2d) \over 2 &rcub; $$
    <p>Multiplying out by \(b-a\)</p>
    $$ = &lcub; c\cdot(b-a)\cdot(b+a)+2d\cdot(b-a) \over 2 &rcub; $$
    <p>Rewriting \((b-a)\cdot(b+a)\) as \(b^2-a^2\)</p>
    $$ = &lcub; c\cdot(b^2-a^2)+2d\cdot(b-a) \over 2 &rcub; $$
    <p>Finally taking the fraction into 2 parts</p>
    $$ = \frac 1 2 \cdot c\cdot(b^2-a^2) + d\cdot(b-a) ; $$
    {#if desmosLoaded}
        <Calculator
            expressions={[
                {
                    latex: r`f\left(x\right)=cx+d`,
                },
                {
                    latex: r`A=\frac{1}{2}c\left(b^{2}-a^{2}\right)+d\left(b-a\right)`,
                },
                {
                    latex: r`a=1`,
                },
                {
                    latex: r`b=3`,
                },
                {
                    latex: r`c=1.5`,
                },
                {
                    latex: r`d=-1`,
                },
                {
                    latex: r`0\le y\le f\left(x\right)\left\{a\le x\le b\right\}`,
                    color: "#388c46",
                    secret: true,
                },
                {
                    latex: r`f\left(x\right)\le y\le0\left\{a\le x\le b\right\}`,
                    color: "#c74440",
                    secret: true,
                },
            ]}
        />
    {/if}
    <p>
        We have now seen the solution to the area under \(f(x)=cx+d\) between
        \(a\) and \(b\), but how do we write this notion down compactly?
    </p>
    <p>
        I will now introduce the <strong>Definite Integral</strong>. It is
        generally written like this:
    </p>
    $$\int_a^bf(x) \, dx$$
    <p>
        The definite integral consists of 4 parts: the integral sign, the
        bounds, the function and the differential.
    </p>
    <p>
        The first part is the integral sign, which looks like this: \(\int\).
        It's kind of like an elongated letter 's'
    </p>
    <p>
        Next to the integral sign are the limits of integration, aka. the
        bounds. They are the bounds of the area under the curve. The lower bound
        is near the bottom, the upper bound is near the top of the integral
        sign.
    </p>
    <p>
        The function is the expression in the middle, it can be anything. Here,
        it is \(f(x)\). It is inbetween the integral sign and the differential.
    </p>
    <p>
        The last part is the differential. It tells us what is the variable we
        are working with. Here, it is \(\, dx\), meaning the integral is with
        respect to \(x\).
    </p>
    <p>We can change our integral, to look like this, for example:</p>
    $$\int_0^\frac \pi 2 \cos(\theta) \, d\theta$$
    <p>
        Meaning the area under the curve of \(\cos(\theta)\) from \(\theta=0\)
        to \(\theta=\frac \pi 2 \). We can see from the graph below, that the
        integral evaluates to 1, but why? It's not as trivial as finding the
        area of a trapezoid.
    </p>
    <p>I will be talking about non-trivial integrals in the next lesson</p>
    {#if desmosLoaded}
        <Calculator
            expressions={[
                {
                    latex: r`f\left(\theta\right)=\cos\left(\theta\right)`,
                },
                {
                    latex: r`\int_{0}^{\frac{\pi}{2}}f\left(\theta\right)d\theta`,
                },
                {
                    latex: r`a=0`,
                    sliderBounds: {
                        min: "0",
                        max: "0",
                        step: "",
                    },
                },
                {
                    latex: r`b=\frac{\pi}{2}`,
                    sliderBounds: {
                        min: "\frac{pi}{2}",
                        max: "\frac{pi}{2}",
                        step: "",
                    },
                },
                {
                    latex: r`0\le y\le f\left(x\right)\left\{a\le x\le b\right\}`,
                    color: "#388c46",
                    secret: true,
                },
                {
                    latex: r`f\left(x\right)\le y\le0\left\{a\le x\le b\right\}`,
                    color: "#c74440",
                    secret: true,
                },
            ]}
        />
    {/if}
</MathContext>

<style lang="scss">
</style>
