<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    const cellSize = 20;
    export let width: number = 10;
    export let height: number = 10;
    onMount(() => {
        console.log("asd1");
    });
    afterUpdate(() => {
        if (!canvas) return;
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(0.5, 0)
        for (let index = 0; index <= width; index++) {
            ctx.moveTo(index * (cellSize + 1), 0);
            ctx.lineTo(index * (cellSize + 1), pixelHeight);
            ctx.stroke();
        }
        ctx.translate(-0.5, 0)
        ctx.translate(0, 0.5)
        for (let index = 0; index <= height; index++) {
            ctx.moveTo(0, index * (cellSize + 1));
            ctx.lineTo(pixelWidth, index * (cellSize + 1));
            ctx.stroke();
        }
        ctx.translate(0, -0.5)
        console.log(board.toString());
    });
    let canvas: HTMLCanvasElement;
    let board: number[][];
    $: {
        board = new Array<number[]>(width);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array<number>(height);
        }
    }
    $: pixelWidth = width * (cellSize + 1) + 1;
    $: pixelHeight = height * (cellSize + 1) + 1;
</script>

<input type="range" min="0" max="30" bind:value={width} />
<input type="range" min="0" max="30" bind:value={height} />
<canvas
    width={pixelWidth}
    height={pixelHeight}
    bind:this={canvas}
/>

<style lang="scss">
    canvas {
        display: block;
        image-rendering: pixelated;
    }
</style>
