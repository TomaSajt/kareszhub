<script lang="ts">
    import type { Color, Instruction } from "src/libs/KOTW/instructions";
    import { onMount } from "svelte";

    enum Cell {
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
    const defaultWidth = 30;

    const minHeight = 1;
    const maxHeight = 20;
    const defaultHeight = 20;

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

    //bind:this
    let canvas: HTMLCanvasElement;
    let kareszImgNorth: HTMLImageElement;
    let kareszImgEast: HTMLImageElement;
    let kareszImgSouth: HTMLImageElement;
    let kareszImgWest: HTMLImageElement;
    let fileInput: HTMLInputElement;

    //Variables
    let running = false;
    let width: number = defaultWidth;
    let height: number = defaultHeight;
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
        clampKaresz();
    }
    function newBoardFromPartial(w: number, h: number, prev: Board) {
        let newBoard = emptyBoard(w, h);
        if (!prev) return newBoard;
        for (let j = 0; j < Math.min(prev.length, h); j++) {
            for (let i = 0; i < Math.min(prev[j].length, w); i++) {
                newBoard[j][i] = prev[j][i];
            }
        }
        return newBoard;
    }

    function newBoard(w: number, h: number) {
        return newBoardFromPartial(w, h, board);
    }

    function clampKaresz() {
        if (kareszPosX >= width) kareszPosX = width - 1;
        if (kareszPosY >= height) kareszPosY = height - 1;
    }

    $: {
        width;
        height;
        board;
        kareszPosX;
        kareszPosY;
        kareszDir;
        if (typeof requestAnimationFrame !== "undefined")
            requestAnimationFrame(renderCanvas);
    }
    function emptyBoard(w: number, h: number) {
        let emptyB: Board = new Array<Cell[]>(h);
        for (let j = 0; j < h; j++) {
            emptyB[j] = new Array<Cell>(w).fill(Cell.Empty);
        }
        return emptyB;
    }
    function renderCanvas() {
        if (!canvas) return;
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i <= width; i++) {
            ctx.beginPath();
            ctx.moveTo(i * (cellSize + 1) + 0.5, 0);
            ctx.lineTo(i * (cellSize + 1) + 0.5, pixelHeight);
            ctx.stroke();
        }
        for (let i = 0; i <= height; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * (cellSize + 1) + 0.5);
            ctx.lineTo(pixelWidth, i * (cellSize + 1) + 0.5);
            ctx.stroke();
        }
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                if (board[j][i] == Cell.Wall) {
                    ctx.fillStyle = "gray";
                    ctx.fillRect(
                        i * (cellSize + 1) + 1,
                        j * (cellSize + 1) + 1,
                        cellSize,
                        cellSize
                    );
                } else if (board[j][i] > Cell.Wall) {
                    ctx.fillStyle = CellToColor(board[j][i]);
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
        let file = this.files[0];
        this.value = "";
        if (!file) return;
        if (!file.name.endsWith(".krm") && !file.name.endsWith('.txt')) return alert("Invalid file extension");
        let text = await file.text();
        if (!validateContent(text)) return alert("Invalid file content");
        let partialNewBoard = parseInput(text);
        let grWidth = 0
        for (let j = 0; j < partialNewBoard.length; j++) {
            if(partialNewBoard[j].length> grWidth) grWidth = partialNewBoard[j].length;
        }
        width = grWidth
        height = partialNewBoard.length
        board = newBoardFromPartial(grWidth, partialNewBoard.length, partialNewBoard)
    }
    function validateContent(text: string) {
        return !!text.match(/^\d+((,|\t)\d+)*((\r\n|\n)\d+((,|\t)\d+)*)*(\r\n|\n)?$/);
    }
    function parseInput(text: string): Board {
        let a = text
        console.log(a);
        let b = a.trim()
        console.log(b);
        let c = b.replace(/\r\n/g, "\n")
        console.log(c);
        let d = c.replace(/\t/g, ',')
        console.log(d);
        let e = d.split("\n")
        console.log(e);
        let f = e.map((line) => line.split(",").map(split=> parseInt(split)));
        console.log(f);
        return f
    }

    function reset() {
        width = defaultWidth
        height = defaultHeight
        board = emptyBoard(defaultWidth, defaultHeight);
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
        board[kareszPosY][kareszPosX] = ColorToCell(color);
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
            board[y][x] != Cell.Wall
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

    onMount(() => {
        let ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        DirToImage(kareszDir).addEventListener("load", () => renderCanvas());
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
<div id="btn-box">
    <button
        disabled={running}
        on:click={async () => {
            running = true;
            await execute(instructions);
            running = false;
        }}>{running ? "Running" : "Run"}</button
    >
    <input
        type="file"
        id="myFile"
        name="filename"
        accept=".txt,.krm"
        on:change={handleFileUploaded}
        bind:this={fileInput}
    />
    <button
        on:click={() => {
            fileInput.click();
        }}>Upload level</button
    >
    <button on:click={reset}>Reset</button>
</div>

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
    #btn-box {
        display: flex;
        margin: auto;
        width: fit-content;
        flex-direction: column;
        align-items: center;
        > * {
            margin-top: 10px;
            display: block;
            width: fit-content;
        }
    }
    input[type="file"] {
        display: none !important;
    }
</style>
