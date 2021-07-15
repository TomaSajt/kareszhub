<script lang="ts">
    import type { Socket } from "socket.io-client";
    export let socket: Socket = undefined;
    export let connected = false;
    let inited = false;
    let sendButton: HTMLButtonElement;
    let msgareatext = "";
    $: trimmedText = msgareatext.trim();
    $: remainingChars = 200 - trimmedText.length;
    $: if (connected && !inited) {
        inited = true;
        socket.on("emit-message", (msg: string) => {
            console.log("You got the following message:", msg);
            messages = [...messages, msg];
        });
    }
    function sendMessage() {
        socket.emit("sendMessage", trimmedText);
        messages = [...messages, trimmedText];
        msgareatext = "";
    }
    let messages: string[] = [];
</script>

<div id="container">
    <button
        bind:this={sendButton}
        disabled={trimmedText.length < 1 || trimmedText.length > 200}
        on:click={sendMessage}>Send</button
    ><br />
    <div id="text-container">
        <textarea
            on:keypress={(ev) => {
                if ((ev.ctrlKey || ev.shiftKey) && ev.code === "Enter") {
                    ev.preventDefault();
                    sendButton.click();
                }
            }}
            name="msg-area"
            id="msg-area"
            cols="30"
            rows="10"
            bind:value={msgareatext}
        />
        <span
            style="color: {remainingChars > 20
                ? 'rgba(0, 127, 0)'
                : remainingChars > 0
                ? 'rgba(255, 120, 32)'
                : 'rgba(255, 0, 0)'};">{remainingChars}</span
        >
    </div>

    {#each messages as msg, i}
        <p>{i + 1}. message: {msg}</p>
    {/each}
</div>

<style lang="scss">
    #text-container {
        position: relative;
        width: fit-content;
    }
    span {
        position: absolute;
        right: 10px;
        bottom: 10px;
        opacity: 0.5;
    }
</style>
