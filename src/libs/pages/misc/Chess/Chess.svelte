<script lang="ts">
    let boardData = [
        ["R", "Kn", "B", "Q", "Ko", "B", "Kn", "R"],
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["E", "E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E", "E"],
        ["E", "E", "E", "E", "E", "E", "E", "E"],
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["R", "Kn", "B", "Q", "Ko", "B", "Kn", "R"],
    ];
</script>

<div id="chess-board">
    {#each boardData as column}
        {#each column as cell}
            <div class="cell">
                <span>{cell}</span>
            </div>
        {/each}
    {/each}
</div>

<style lang="scss">
    #chess-board {
        display: grid;
        grid-template-columns: repeat(8, auto);
    }
    .cell {
        width: 3em;
        height: 3em;
        display: grid;
        place-items: center;
    }
</style>
