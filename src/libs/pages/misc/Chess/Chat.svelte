<script lang="ts">
    import type { Socket } from "socket.io-client";
    export let socket: Socket = undefined;
    socket.on("emit-message", (msg: string) => {
        console.log("You got the following message:", msg);
        addMessage({ content: msg, author: "Unknown" });
    });
    let inited = false;
    let sendButton: HTMLButtonElement;
    let msgareatext = "";
    $: trimmedText = msgareatext.trim();
    $: remainingChars = 200 - trimmedText.length;
    function sendMessage() {
        socket.emit("sendMessage", trimmedText);
        addMessage({ content: trimmedText, author: "You" });
        msgareatext = "";
    }
    function addMessage(msg: MessageData) {
        messages = [...messages, msg];
    }
    type MessageData = {
        content: string;
        author: string;
    };
    let messages: MessageData[] = [];
</script>

<div id="container">
    <div id="messages">
        {#each messages as msg, i}
            <div class={`msg ${msg.author == "You" ? "own-msg" : ""}`}>
                {msg.content}
            </div>
        {/each}
    </div>
    <div id="bottom-container">
        <button
            id="send"
            bind:this={sendButton}
            disabled={trimmedText.length < 1 || trimmedText.length > 200}
            on:click={sendMessage}>Send</button
        >
        <div id="text-container">
            <textarea
                on:keypress={(ev) => {
                    if ((ev.ctrlKey || ev.shiftKey) && ev.code === "Enter") {
                        ev.preventDefault();
                        sendButton.click();
                    }
                }}
                rows="2"
                name="msg-area"
                id="msg-area"
                style="resize: none;"
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
    </div>
</div>

<style lang="scss">
    #container {
        width: 400px;
    }
    #messages {
        outline: 1px solid black;
        padding: 5px;
        .msg {
            padding: 5px 10px;
            border-radius: 10px;
            width: fit-content;
            max-width: calc(160px);
            background-color: #888;
            color: white;
            text-align: left;
            font: 400 13.3333px Arial;
            overflow-wrap: break-word;
            &:not(:first-child) {
                margin-top: 5px;
            }
            &.own-msg {
                margin-left: auto;
                background-color: hsl(236, 90%, 51%);
            }
        }
    }
    #text-container {
        position: relative;
        width: fit-content;
        textarea {
            width: 300px;
            display: block;
        }
    }
    #bottom-container {
        display: flex;
        align-items: center;
        outline: 1px solid black;
    }
    #send {
        flex-grow: 1;
    }
    span {
        position: absolute;
        right: 10px;
        bottom: 10px;
        opacity: 0.5;
    }
</style>
