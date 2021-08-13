<script lang="ts">
    export let dead: boolean;
    export let isDeathPos: boolean;
    export let isRevealed: boolean;
    export let isMine: boolean;
    export let adjacentMines: number;
    export let tryReveal: () => any;
</script>

<div
    class="cell"
    on:click={() => {
        tryReveal();
    }}
    style="background-color: {isDeathPos
        ? 'fuchsia'
        : dead && isMine
        ? 'red'
        : isRevealed
        ? adjacentMines == 0
            ? 'green'
            : 'orange'
        : 'white'};"
>
    <span
        >{(() => {
            if (dead && isMine) return "X";
            if (isRevealed) return adjacentMines.toString();
            return "";
        })()}</span
    >
</div>

<style lang="scss">
    .cell {
        width: 32px;
        height: 32px;
        font-size: 10px;
        display: grid;
        place-items: center;
        border: 1px solid;
    }
</style>
