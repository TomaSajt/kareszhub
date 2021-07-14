<script lang="ts">
    import sioClient, { Socket } from "socket.io-client";
    import Chat from "./Chat.svelte";
    let socket: Socket = undefined;
    let connected = false;
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

<div id="container">
    {#if !connected}
        <button
            on:click={() => {
                if (!socket) {
                    socket = sioClient("http://localhost:5000");
                    socket.on("connect", () => {
                        if (connected) return;
                        console.log("connected");
                        connected = true;
                    });
                }
            }}>Connect</button
        >
    {:else}
        <Chat {socket} {connected} />
    {/if}
    <div id="chess-board">
        {#each boardData as column}
            {#each column as cell}
                <div class="cell">
                    <span>{cell}</span>
                </div>
            {/each}
        {/each}
    </div>
</div>

<style lang="scss">
    #container {
        display: grid;
        justify-items: center;
    }
    #chess-board {
        display: grid;
        grid-template-columns: repeat(8, auto);
        width: fit-content;
    }
    .cell {
        width: 3em;
        height: 3em;
        display: grid;
        place-items: center;
    }
</style>
