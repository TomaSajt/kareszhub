<script lang="ts">
    let x = 0;
    let y = 0;
    $: shadowText =
        shadowTextGen() + `transform: translate(${25 * x}px, ${25 * y}px);`;

    function shadowTextGen() {
        let str = "box-shadow: ";
        for (let i = 1; i <= 24; i++) {
            str += `${-i * x}px ${-i * y}px 0 ${-5 * i}px ${
                i % 2 == 0 ? "blue" : "green"
            }, `;
        }
        str = str.substr(0, str.length - 2) + ";";
        console.log(str);
        return str;
    }
</script>
<svelte:head>
    <title>3D Thingy</title>
</svelte:head>

<input type="range" min="-17" max="17" bind:value={x} />
<input
    type="range"
    min="-17"
    max="17"
    bind:value={y}
    {...{ orient: "vertical" }}
/>
<div class="box" style={shadowText} />

<style lang="scss">
    .box {
        position: absolute;
        inset: 0;
        width: 300px;
        aspect-ratio: 1/1;
        background-color: red;
        margin: auto;
    }
    ::-webkit-slider-runnable-track {
        background-color: white;
        border: solid 1px;
        border-radius: 10px;
    }
    input {
        display: block;
    }
    input[type="range"][orient="vertical"] {
        writing-mode: bt-lr; /* IE */
        -webkit-appearance: slider-vertical; /* WebKit */
        width: 8px;
        padding: 0 5px;
        transform: rotate(180deg);
    }
</style>
