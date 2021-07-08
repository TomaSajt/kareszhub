<script lang="ts">
    import type { Color, Instruction } from "src/libs/KOTW/instructions";

    import { afterUpdate, onDestroy, onMount, tick } from "svelte";
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

    const instructions: Instruction[] = [
        {
            name: "repeat",
            times: 4,
            children: [
                {
                    name: "repeat",
                    times: 2,
                    children: [
                        { name: "step" },
                        { name: "place", color: "red" },
                        { name: "step" },
                        { name: "place", color: "red" },
                        { name: "turnright" },
                    ],
                },
                { name: "step" },
                { name: "place", color: "red" },
                { name: "step" },
                { name: "place", color: "red" },
                { name: "turnleft" },
            ],
        },
        {
            name: "repeat",
            times: 4,
            children: [
                { name: "step" },
                { name: "turnright" },
                { name: "step" },
                { name: "turnleft" },
            ],
        },
    ];

    function DirToImage(dir: Dir) {
        switch (dir) {
            case Dir.North:
                return kareszImgNorth;
            case Dir.East:
                return kareszImgEast;
            case Dir.South:
                return kareszImgSouth;
            case Dir.West:
                return kareszImgWest;
        }
    }
    function ColorToCell(color: Color): Cell {
        switch (color) {
            case "black":
                return Cell.Black;
            case "red":
                return Cell.Red;
            case "green":
                return Cell.Green;
            case "yellow":
                return Cell.Yellow;
            case "blue":
                return Cell.Blue;
        }
    }

    function CellToColor(cell: Cell): Color {
        switch (cell) {
            case Cell.Black:
                return "black";
            case Cell.Red:
                return "red";
            case Cell.Green:
                return "green";
            case Cell.Yellow:
                return "yellow";
            case Cell.Blue:
                return "blue";
        }
    }

    //Variables
    let running = false;
    let width: number = maxWidth;
    let height: number = maxHeight;
    let canvas: HTMLCanvasElement;
    let kareszImgNorth: HTMLImageElement;
    let kareszImgEast: HTMLImageElement;
    let kareszImgSouth: HTMLImageElement;
    let kareszImgWest: HTMLImageElement;
    let board: Board;
    let kareszPosX = 4;
    let kareszPosY = 2;
    let kareszDir = Dir.East;

    // Computed properties
    $: pixelWidth = width * (cellSize + 1) + 1;
    $: pixelHeight = height * (cellSize + 1) + 1;

    // Board recalc
    $: {
        board = newBoard(width, height);
        clapKaresz();
    }

    function clapKaresz() {
        if (kareszPosX >= width) kareszPosX = width - 1;
        if (kareszPosY >= height) kareszPosY = height - 1;
    }

    $: {
        board;
        kareszPosX;
        kareszPosY;
        kareszDir;
        renderCanvas();
    }

    function newBoard(width: number, height: number) {
        let newBoard: Board = new Array<Cell[]>(width);
        for (let i = 0; i < width; i++) {
            newBoard[i] = new Array<Cell>(height).fill(Cell.Empty);
        }
        if (!board) return newBoard;

        for (let i = 0; i < Math.min(board.length, width); i++) {
            for (let j = 0; j < Math.min(board[i].length, height); j++) {
                newBoard[i][j] = board[i][j];
            }
        }
        return newBoard;
    }
    function renderCanvas() {
        if (!canvas) return;
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let index = 0; index <= width; index++) {
            ctx.beginPath();
            ctx.moveTo(index * (cellSize + 1) + 0.5, 0);
            ctx.lineTo(index * (cellSize + 1) + 0.5, pixelHeight);
            ctx.stroke();
        }
        for (let index = 0; index <= height; index++) {
            ctx.beginPath();
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
                    ctx.fillStyle = CellToColor(board[i][j]);
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
            DirToImage(kareszDir),
            kareszPosX * (cellSize + 1) + 1,
            kareszPosY * (cellSize + 1) + 1
        );
    }

    async function handleFileUploaded(this: HTMLInputElement) {
        if (this.files) {
            let text = await this.files[0].text();

            console.log(text);
        }
    }

    function getDX() {
        return kareszDir == Dir.East ? 1 : kareszDir == Dir.West ? -1 : 0;
    }
    function getDY() {
        return kareszDir == Dir.South ? 1 : kareszDir == Dir.North ? -1 : 0;
    }
    function turnRight() {
        kareszDir = (kareszDir + 1) % 4;
    }
    function turnLeft() {
        kareszDir = (kareszDir + 3) % 4;
    }
    function place(color: Color) {
        board[kareszPosX][kareszPosY] = ColorToCell(color);
    }
    function step() {
        let nextX = kareszPosX + getDX();
        let nextY = kareszPosY + getDY();
        if (!isPositionValid(nextX, nextY)) {
            console.log("unable to step");
            return;
        }
        kareszPosX = nextX;
        kareszPosY = nextY;
    }
    function isPositionValid(x: number, y: number) {
        return (
            x >= 0 &&
            y >= 0 &&
            x < width &&
            y < height &&
            board[x][y] != Cell.Wall
        );
    }

    async function execute(insts: Instruction[]) {
        for (let i = 0; i < insts.length; i++) {
            const inst = insts[i];
            switch (inst.name) {
                case "step":
                    step();
                    await sleep(100);
                    break;
                case "turnright":
                    turnRight();
                    await sleep(100);
                    break;
                case "turnleft":
                    turnLeft();
                    await sleep(100);
                    break;
                case "place":
                    place(inst.color);
                    await sleep(100);
                    break;

                case "repeat":
                    {
                        let times = inst.times;
                        for (let j = 0; j < times; j++) {
                            await execute(inst.children);
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    }

    function sleep(time: number) {
        return new Promise<void>((r) => setTimeout(() => r(), time));
    }
    function validateContent(text: string) {}

    onMount(() => {
        let ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        DirToImage(kareszDir).addEventListener("load", () => renderCanvas());
        renderCanvas();
    });
    onDestroy(() => {
        console.log("destroyed");
    });
    afterUpdate(() => {
        console.log("after update");
        renderCanvas();
    });
</script>

<img src="Karesz0.png" alt="" bind:this={kareszImgNorth} />
<img src="Karesz1.png" alt="" bind:this={kareszImgEast} />
<img src="Karesz2.png" alt="" bind:this={kareszImgSouth} />
<img src="Karesz3.png" alt="" bind:this={kareszImgWest} />
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
    id="run-btn"
    disabled={running}
    on:click={async () => {
        running = true;
        await execute(instructions);
        running = false;
    }}>{running ? 'Running' : 'Run'}</button
>
<input
    type="file"
    id="myFile"
    name="filename"
    accept=".krm"
    on:change={handleFileUploaded}
/>

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
    #run-btn {
        display: block;
        margin: auto;
        margin-top: 20px;
    }
</style>
