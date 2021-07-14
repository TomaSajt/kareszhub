<script lang="ts">
    import sioClient, { Socket } from "socket.io-client";
    import Chat from "./Chat.svelte";
    const ip = "http://localhost:5000";
    let socket: Socket = null;
    let connected = false;
    let connecting = false;
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

    function createNewSocket() {
        socket = sioClient(ip);
        connecting = true;
        socket.on("connect", () => {
            if (connected) return;
            console.log("connected");
            connected = true;
            connecting = false;
        });
        socket.on("connect_error", () => {
            console.log(`Couldn't connect to server, closing connection`);
            removeSocket();
        });
        socket.on('disconnect', ()=>{
            console.log(`Connection was disconnected, closing connection`);
            removeSocket();
        })
    }
    function removeSocket() {
        if (socket instanceof Socket) {
            socket.close();
            socket = null;
            connected = false;
            connecting = false;
        }
    }
</script>

<div id="container">
    {#if !connected}
        <button
            on:click={() => {
                if (!socket) {
                    createNewSocket();
                }
            }}>Connect</button
        >
        {#if connecting}
            <span>Connecting...</span>
        {/if}
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
