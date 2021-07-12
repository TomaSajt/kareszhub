<script lang="ts">
    import { tick } from "svelte";

    export let width: number;
    export let height: number;
    export let mines: number;
    let mineBoard: BoolBoard = [];
    let revealedBoard: BoolBoard = [];
    let adjacencyBoard: NumberBoard = [];
    let dead = false;
    let deathPos = -1;
    type BoolBoard = boolean[];
    type NumberBoard = number[];
    type Coord = { x: number; y: number };

    $: if (typeof window !== "undefined") {
        width;
        height;
        mines;
        newGame();
    }
    function newGame() {
        dead = false;
        deathPos = -1;
        mineBoard = new Array<boolean>(width * height)
            .fill(false)
            .fill(true, 0, mines);
        shuffleArray(mineBoard);
        revealedBoard = new Array<boolean>(mineBoard.length).fill(false);
        adjacencyBoard = new Array<number>(mineBoard.length)
            .fill(0)
            .map((_, i) => NeighboursMineCount(i));
        logBoard(mineBoard);
        logBoard(revealedBoard);
        logBoard(adjacencyBoard);
    }
    function _2DTo1D(pos: Coord) {
        return pos.x + pos.y * width;
    }
    function _1DTo2D(i: number): Coord {
        return { x: i % width, y: Math.floor(i / width) };
    }
    function logBoard<T>(board: T[]) {
        let copy = [...board];
        for (let j = 0; j < height; j++) {
            console.log(copy.splice(0, width));
        }
    }
    function shuffleArray<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    function reveal(i: number) {
        if (mineBoard[i]) return explode(i);
        if (revealedBoard[i]) return;
        revealedBoard[i] = true;
        if (adjacencyBoard[i] != 0) return;
        let neighbours = IndexToNeigbours(i);
        for (const neighbour of neighbours) {
            reveal(neighbour);
        }
    }
    async function explode(i: number) {
        dead = true;
        deathPos = i;
        alert("You clicked on a mine!!!");
    }
    function IndexToNeigbours(i: number): number[] {
        let neighbours: number[] = [];
        let pos2d = _1DTo2D(i);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy += dx == 0 ? 2 : 1) {
                let currOffset: Coord = { x: pos2d.x - dx, y: pos2d.y - dy };
                if (Is2DPosValid(currOffset))
                    neighbours.push(_2DTo1D(currOffset));
            }
        }
        return neighbours;
    }
    function Is2DPosValid(pos: Coord) {
        return pos.x >= 0 && pos.y >= 0 && pos.x < width && pos.y < height;
    }
    function NeighboursMineCount(i: number) {
        return IndexToNeigbours(i)
            .map((pos) => mineBoard[pos])
            .filter(Boolean).length;
    }
</script>

<div id="container" style="grid-template-columns: repeat({width}, auto);">
    {#each Array(width * height) as _, i}
        <div
            class="cell"
            on:click={() => {
                reveal(i);
                logBoard(revealedBoard);
            }}
            style="background-color: {(() => {
                if (deathPos == i) return 'fuchsia';
                if (dead && mineBoard[i]) {
                    return 'red';
                }
                if (revealedBoard[i]) {
                    if (adjacencyBoard[i] == 0) {
                        return 'green';
                    }
                    return 'orange';
                }
                return 'white';
            })()};"
        >
            <span
                >{(() => {
                    if (dead && mineBoard[i]) return "X";
                    if (revealedBoard[i]) return adjacencyBoard[i].toString();
                    return "";
                })()}</span
            >
        </div>
    {/each}
</div>
<button on:click={newGame}>New Game</button>

<style lang="scss">
    #container {
        display: grid;
        width: fit-content;
        border: 1px solid;
        background-color: black;
    }
    .cell {
        width: 32px;
        height: 32px;
        font-size: 10px;
        display: grid;
        place-items: center;
        border: 1px solid;
    }
</style>
