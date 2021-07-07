<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    enum Cell {
        OOB = -1,
        Empty = 0,
        Wall = 1,
        Black = 2,
        Red = 3,
        Green = 4,
        Yellow = 5,
        Blue = 6
    }

    enum Dir {
        North = 0,
        East = 1,
        South = 2,
        West = 3
    }
    //Constants
    const cellSize = 20;

    const minWidth = 1;
    const maxWidth = 30;

    const minHeight = 1;
    const maxHeight = 20;

    //Cell to Color
    const cellToColorMap = new Map<Cell, string>()
    cellToColorMap.set(Cell.Black, 'black')
    cellToColorMap.set(Cell.Red, 'red')
    cellToColorMap.set(Cell.Green, 'green')
    cellToColorMap.set(Cell.Yellow, 'yellow')
    cellToColorMap.set(Cell.Blue, 'blue')
    function isStone(posX: number, posY: number) {
        return board[posX][posY] > 1
    }

    //Variables
    let width: number = 15;
    let height: number = 10;
    let canvas: HTMLCanvasElement;
    let kareszImg: HTMLImageElement;
    let board: Cell[][];
    let prevBoard: Cell[][];

    // Computed properties
    $: pixelWidth = width * (cellSize + 1) + 1;
    $: pixelHeight = height * (cellSize + 1) + 1;

    // Board recalc
    $: {
        board = [];
        for (let i = 0; i < width; i++) {
            board[i] = [];
            for (let j = 0; j < height; j++) {
                board[i][j] = Math.floor(Math.random() * 2) ? Cell.Empty : Cell.Black;
            }
        }
        console.log('Board', board);
        console.log('Prev Board', prevBoard);
        console.log('end');
        
        prevBoard = board;
    }

    onMount(() => {
        let ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
    });
    afterUpdate(() => {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let index = 0; index <= width; index++) {
            ctx.moveTo(index * (cellSize + 1) + 0.5, 0);
            ctx.lineTo(index * (cellSize + 1) + 0.5, pixelHeight);
            ctx.stroke();
        }
        for (let index = 0; index <= height; index++) {
            ctx.moveTo(0, index * (cellSize + 1) + 0.5);
            ctx.lineTo(pixelWidth, index * (cellSize + 1) + 0.5);
            ctx.stroke();
        }
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                if (isStone(i, j)) {
                    ctx.drawImage(
                        kareszImg,
                        i * (cellSize + 1) + 1,
                        j * (cellSize + 1) + 1
                    );
                }
                board[i][j];
            }
        }
    });
</script>

<div id="sliderContainer">
    <div>
        <label for="widthSlider">Width</label><br />
        <input
            type="range"
            min={minWidth}
            max={maxWidth}
            bind:value={width}
            id="widthSlider"
            name="widthSlider"
        /><br />
    </div>
    <div>
        <label for="heightSlider">Height</label><br />
        <input
            type="range"
            min={minHeight}
            max={maxHeight}
            bind:value={height}
            id="heightSlider"
            name="heightSlider"
        />
    </div>
</div>
<canvas
    width={pixelWidth}
    height={pixelHeight}
    bind:this={canvas}
    style="--width: {pixelWidth * 2}px; --height: {pixelHeight * 2}px"
/>
<img src="/static/favicon.png" alt="Karesz" bind:this={kareszImg} />

<style lang="scss">
    img {
        display: none;
    }
    canvas {
        display: block;
        image-rendering: pixelated;
        margin: auto;
        width: var(--width);
        height: var(--height);
    }

    #sliderContainer {
        margin: auto;
        display: flex;
        text-align: center;
        flex-wrap: wrap;
        width: fit-content;
        input {
            width: 200px;
        }
        label {
            font-size: 1.5em;
        }
    }
</style>
