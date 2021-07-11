<script lang="ts">
    import type { Color, Instruction } from "../libs/KOTW/instructions";
    import Instructions from "../libs/KOTW/Instuctions.svelte";
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

    const minSpeed = 1;
    const maxSpeed = 40;
    const defaultSpeed = 10;

    let instructions: Instruction[] = [
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
                        { name: "place", color: "green" },
                        { name: "turnright" },
                    ],
                },
                { name: "step" },
                { name: "place", color: "red" },
                { name: "step" },
                { name: "place", color: "green" },
                { name: "turnleft" },
            ],
        },
        {
            name: "repeat",
            times: 4,
            children: [
                {
                    name: "repeat",
                    times: 2,
                    children: [
                        { name: "step" },
                        { name: "pickup" },
                        { name: "step" },
                        { name: "pickup" },
                        { name: "turnright" },
                    ],
                },
                { name: "step" },
                { name: "pickup" },
                { name: "step" },
                { name: "pickup" },
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
    let speed = defaultSpeed;
    let board: Board;
    let kareszPosX = 4;
    let kareszPosY = 2;
    let kareszDir = Dir.East;
    let hoveredX = -1;
    let hoveredY = -1;

    // Computed properties
    $: pixelWidth = width * (cellSize + 1) + 1;
    $: pixelHeight = height * (cellSize + 1) + 1;
    $: sleepTime = 1000 / speed;

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
        hoveredX;
        hoveredY;
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
        ctx.fillStyle = "#eee";
        ctx.fillRect(
            hoveredX * (cellSize + 1) + 1,
            hoveredY * (cellSize + 1) + 1,
            cellSize,
            cellSize
        );
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
    function handleMouseDown(this: HTMLCanvasElement, ev: MouseEvent) {
        ev.preventDefault();
        let boardPos = mouseEventToBoardPos(this, ev);
        onBoardClick(boardPos.x, boardPos.y, ev);
    }
    function handleMouseMove(this: HTMLCanvasElement, ev: MouseEvent) {
        ev.preventDefault();
        let boardPos = mouseEventToBoardPos(this, ev);
        if (hoveredX != boardPos.x) {
            hoveredX = boardPos.x;
        }
        if (hoveredY != boardPos.y) {
            hoveredY = boardPos.y;
        }
    }
    function mouseEventToBoardPos(el: Element, ev: MouseEvent) {
        const rect = el.getBoundingClientRect();
        let clickX = ev.clientX - rect.left;
        let clickY = ev.clientY - rect.top;
        let almostBoardX = Math.floor(clickX / (2 * (cellSize + 1)));
        let almostBoardY = Math.floor(clickY / (2 * (cellSize + 1)));
        let boardX = Math.min(almostBoardX, width - 1);
        let boardY = Math.min(almostBoardY, height - 1);
        return {
            x: boardX,
            y: boardY,
        };
    }
    function onBoardClick(boardX: number, boardY: number, ev: MouseEvent) {
        if (ev.button == 0) {
            if (kareszPosX == boardX && kareszPosY == boardY) {
                turnRight();
                return;
            }
            kareszPosX = boardX;
            kareszPosY = boardY;
        } else if (ev.button == 2) {
            board[boardY][boardX] =
                board[boardY][boardX] == Cell.Empty ? Cell.Wall : Cell.Empty;
        }
    }

    async function handleFileUploaded(this: HTMLInputElement) {
        let file = this.files[0];
        this.value = "";
        if (!file) return;
        if (!file.name.endsWith(".krm") && !file.name.endsWith(".txt"))
            return alert("Invalid file extension");
        let text = await file.text();
        if (!validateContent(text)) return alert("Invalid file content");
        let partialNewBoard = parseInput(text);
        let grWidth = 0;
        for (let j = 0; j < partialNewBoard.length; j++) {
            if (partialNewBoard[j].length > grWidth)
                grWidth = partialNewBoard[j].length;
        }
        width = grWidth;
        height = partialNewBoard.length;
        board = newBoardFromPartial(
            grWidth,
            partialNewBoard.length,
            partialNewBoard
        );
    }
    function validateContent(text: string) {
        return !!text.match(
            /^\d+((,|\t)\d+)*((\r\n|\n)\d+((,|\t)\d+)*)*(\r\n|\n)?$/
        );
    }
    function parseInput(text: string): Board {
        let a = text;
        console.log(a);
        let b = a.trim();
        console.log(b);
        let c = b.replace(/\r\n/g, "\n");
        console.log(c);
        let d = c.replace(/\t/g, ",");
        console.log(d);
        let e = d.split("\n");
        console.log(e);
        let f = e.map((line) =>
            line.split(",").map((split) => parseInt(split))
        );
        console.log(f);
        return f;
    }
    async function waitBetweenInstrs() {
        await sleep(sleepTime);
    }

    function reset() {
        running = false;
        width = defaultWidth;
        height = defaultHeight;
        speed = defaultSpeed;
        board = emptyBoard(defaultWidth, defaultHeight);
    }

    function complain(text: string) {
        console.warn(text);
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
        if (board[kareszPosY][kareszPosX] != Cell.Empty)
            return complain("I can't place my stone here");
        board[kareszPosY][kareszPosX] = ColorToCell(color);
    }
    function pickup() {
        if (board[kareszPosY][kareszPosX] < 2)
            return complain("I can't pick up anything");
        board[kareszPosY][kareszPosX] = Cell.Empty;
    }
    function step() {
        let nextX = kareszPosX + getDX();
        let nextY = kareszPosY + getDY();
        if (!isPositionValid(nextX, nextY))
            return complain("I can't step forward");
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

    async function run() {
        running = true;
        await execute(instructions);
        running = false;
    }
    async function execute(insts: Instruction[]) {
        for (let i = 0; i < insts.length; i++) {
            if (!running) return;
            const inst = insts[i];
            switch (inst.name) {
                case "step":
                    step();
                    await waitBetweenInstrs();
                    break;
                case "turnright":
                    turnRight();
                    await waitBetweenInstrs();
                    break;
                case "turnleft":
                    turnLeft();
                    await waitBetweenInstrs();
                    break;
                case "place":
                    place(inst.color);
                    await waitBetweenInstrs();
                    break;
                case "pickup":
                    pickup();
                    await waitBetweenInstrs();
                    break;

                case "repeat":
                    let times = inst.times;
                    for (let j = 0; j < times; j++) {
                        await execute(inst.children);
                    }
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

<div id="hidden-imgs">
    <img src="Karesz0.png" alt="" bind:this={kareszImgNorth} />
    <img src="Karesz1.png" alt="" bind:this={kareszImgEast} />
    <img src="Karesz2.png" alt="" bind:this={kareszImgSouth} />
    <img src="Karesz3.png" alt="" bind:this={kareszImgWest} />
</div>
<div id="slider-container">
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
    <div>
        <label for="speedSlider">Speed</label><br />
        <input
            type="range"
            min={minSpeed}
            max={maxSpeed}
            bind:value={speed}
            id="speedSlider"
            name="speedSlider"
        />
    </div>
</div>
<canvas
    width={pixelWidth}
    height={pixelHeight}
    bind:this={canvas}
    on:mouseleave={() => {
        hoveredX = -1;
        hoveredY = -1;
    }}
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:contextmenu={(e) => e.preventDefault()}
    style="--width: {pixelWidth * 2}px; --height: {pixelHeight * 2}px"
/>
<div id="btn-box">
    <button disabled={running} on:click={run}
        >{running ? "Running" : "Run"}</button
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
    <button on:click={()=>{
        instructions.push({name:"turnleft"})
        instructions = instructions
    }}>Add turn left</button>
    <button on:click={()=>{
        if(instructions[instructions.length-1].name != "turnleft") return
        instructions.pop()
        instructions = instructions
    }}>Remove turn left</button>
</div>
<div id="instrs-container">
    <Instructions instrs={instructions} />
</div>


<style lang="scss">
    #hidden-imgs img {
        display: none;
    }
    canvas {
        display: block;
        image-rendering: pixelated;
        margin: auto;
        width: var(--width);
        height: var(--height);
    }
    #slider-container {
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
    #instrs-container {
        width: fit-content;
        margin: auto;
        padding-bottom: 100px;
    }
</style>
