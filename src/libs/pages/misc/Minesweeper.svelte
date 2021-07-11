<script lang="ts">
    import { onMount } from "svelte";

    export let width;
    export let height;
    export let mines;
    let mineBoard: BoolBoard = [];
    type BoolBoard = boolean[];

    $: {
        if (typeof window !== "undefined") {
            mineBoard = newMineBoard(width, height, mines);
        }
    }
    onMount(() => {
        mineBoard = newMineBoard(width, height, mines);
    });
    function newMineBoard(w: number, h: number, n: number): BoolBoard {
        let newBoard = new Array<boolean>(w * h)
            .fill(false)
            .fill(true, 0, mines);
        shuffleArray(newBoard);
        logBoard(newBoard);
        return newBoard;
    }
    function _2DTo1D(x: number, y: number) {
        return x + y * width;
    }
    function logBoard(board: BoolBoard) {
        let copy = [...board];
        for (let j = 0; j < height; j++) {
            console.log(copy.splice(0, width).map((b) => (b ? "X" : "O")));
        }
    }
    function shuffleArray<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
</script>

<div id="container" style="grid-template-columns: repeat({width}, auto);">
    {#each mineBoard as mine}
        <div class="cell">
            {mine ? "mine" : "safe"}
        </div>
    {/each}
</div>

<style lang="scss">
    #container {
        display: grid;
        width: fit-content;
    }
    .cell {
        width: 32px;
        height: 32px;
        background-color: red;
        font-size: 10px;
    }
</style>
