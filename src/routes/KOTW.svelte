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
        Blue = 6,
    }

    enum Dir {
        North = 0,
        East = 1,
        South = 2,
        West = 3,
    }

    type Board = Cell[][];
    //Constants
    const cellSize = 20;

    const minWidth = 1;
    const maxWidth = 30;

    const minHeight = 1;
    const maxHeight = 20;

    //Cell to Color
    const cellToColorMap = new Map<Cell, string>();
    cellToColorMap.set(Cell.Black, "black");
    cellToColorMap.set(Cell.Red, "red");
    cellToColorMap.set(Cell.Green, "green");
    cellToColorMap.set(Cell.Yellow, "yellow");
    cellToColorMap.set(Cell.Blue, "blue");

    //Variables
    let width: number = 15;
    let height: number = 10;
    let canvas: HTMLCanvasElement;
    let kareszImg: HTMLImageElement;
    let board: Board;
    let kareszPosX = 5;
    let kareszPosY = 5;

    // Computed properties
    $: pixelWidth = width * (cellSize + 1) + 1;
    $: pixelHeight = height * (cellSize + 1) + 1;

    // Board recalc
    $: board = newBoard(width, height);

    function newBoard(width: number, height: number) {
        let newBoard: Board = new Array<Cell[]>(width);
        for (let i = 0; i < width; i++) {
            newBoard[i] = new Array<Cell>(height);
        }
        if (!board) return newBoard;

        for (let i = 0; i < Math.min(board.length, width); i++) {
            for (let j = 0; j < Math.min(board[i].length, height); j++) {
                newBoard[i][j] = board[i][j];
            }
        }
        return newBoard;
    }
    function drawCanvas() {
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
                if (board[i][j] == Cell.Wall) {
                    ctx.fillStyle = "gray";
                    ctx.fillRect(
                        i * (cellSize + 1) + 1,
                        j * (cellSize + 1) + 1,
                        cellSize,
                        cellSize
                    );
                } else if (board[i][j] > Cell.Wall) {
                    ctx.fillStyle = cellToColorMap.get(board[i][j]);
                    ctx.beginPath();
                    ctx.arc(
                        i * (cellSize + 1) + 1 + cellSize / 2,
                        j * (cellSize + 1) + 1 + cellSize / 2,
                        (0.9 * cellSize) / 2,
                        0,
                        2 * Math.PI
                    );
                    ctx.fill();
                }
            }
        }
        ctx.drawImage(
            kareszImg,
            kareszPosX * (cellSize + 1) + 1,
            kareszPosY * (cellSize + 1) + 1
        );
    }

    onMount(() => {
        let ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        kareszImg.addEventListener("load", () => {
            drawCanvas();
        });
    });
    afterUpdate(() => {
        drawCanvas();
    });
</script>

<img src="favicon.png" alt="Karesz" bind:this={kareszImg} />
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
<button
    on:click={() => {
        board[kareszPosX][kareszPosY] = Cell.Red;
        board[kareszPosX + 1][kareszPosY] = Cell.Blue;
        board[kareszPosX - 1][kareszPosY] = Cell.Black;
        board[kareszPosX][kareszPosY + 1] = Cell.Yellow;
        board[kareszPosX][kareszPosY - 1] = Cell.Green;
        board = board;
    }}>Click here</button
>

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
