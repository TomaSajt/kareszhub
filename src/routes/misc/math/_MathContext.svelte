<script context="module" lang="ts">
    declare let MathJax;
</script>

<script lang="ts">
    let desmosLoaded = false;
    import { onMount } from "svelte";
    onMount(() => {
        let desmosScript = document.createElement("script");
        desmosScript.src =
            "https://www.desmos.com/api/v1.6/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
        document.head.append(desmosScript);

        desmosScript.onload = () => {
            desmosLoaded = true;
        };
        let mathJaxScript = document.createElement("script");
        mathJaxScript.src =
            "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
        document.head.append(mathJaxScript);

        mathJaxScript.onload = () => {
            MathJax = {
                tex: {
                    inlineMath: [
                        // start/end delimiter pairs for in-line math
                        ["\\(", "\\)"], ["$", "$"],
                    ],
                    displayMath: [
                        // start/end delimiter pairs for display math
                        ["$$", "$$"],
                        ["\\[", "\\]"],
                    ],
                },
                svg: { fontCache: "global" },
            };
        };
    });
</script>

<div class="fix-width">
    <slot {desmosLoaded} />
</div>
