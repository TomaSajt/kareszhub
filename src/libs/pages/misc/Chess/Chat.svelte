<script lang="ts">
    import type { Socket } from "socket.io-client";
    import { tick } from "svelte";
    import { scale, fly } from "svelte/transition";
    export let socket: Socket = undefined;
    socket.on("emit-message", (msg: string) => {
        console.log("You got the following message:", msg);
        addMessage({ content: msg, author: "Unknown" });
    });
    let msgContainer: HTMLDivElement;
    let sendButton: HTMLButtonElement;
    let msgareatext = "";
    $: trimmedText = msgareatext.trim();
    $: remainingChars = 200 - trimmedText.length;
    function sendMessage() {
        socket.emit("sendMessage", trimmedText);
        addMessage({ content: trimmedText, author: "You" });
        msgareatext = "";
    }
    async function addMessage(msg: MessageData) {
        messages = [...messages, msg];
        await tick();
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }
    type MessageData = {
        content: string;
        author: string;
    };
    let messages: MessageData[] = [];
</script>

<div id="container">
    <div id="msg-container" bind:this={msgContainer}>
        {#each messages as msg, i}
            <div
                transition:fly={{
                    x: msg.author == "You" ? -200 : 200,
                    duration: 200,
                }}
                class={msg.author == "You" ? "msg own-msg" : "msg"}
            >
                <span class="author">{msg.author}</span>
                <div class="msg-box">
                    {msg.content}
                </div>
            </div>
        {/each}
    </div>
    <div id="bottom-container">
        <div id="text-container">
            <textarea
                on:keypress={(ev) => {
                    if (!ev.shiftKey && ev.code === "Enter") {
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
                id="char-counter"
                style="color: {remainingChars > 20
                    ? 'rgba(0, 127, 0)'
                    : remainingChars > 0
                    ? 'rgba(255, 120, 32)'
                    : 'rgba(255, 0, 0)'};">{remainingChars}</span
            >
        </div>
        <button
            id="send"
            bind:this={sendButton}
            disabled={trimmedText.length < 1 || trimmedText.length > 200}
            on:click={sendMessage}>Send</button
        >
    </div>
</div>

<style lang="scss">
    #container {
        width: 400px;

        outline: 1px solid black;
    }
    ::-webkit-scrollbar {
        width: 3px;
    }
    ::-webkit-scrollbar-track {
        background: #eee;
    }
    ::-webkit-scrollbar-thumb {
        background: #777;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #666;
    }
    #msg-container {
        overflow-x: hidden;
        overflow-y: auto;
        height: 300px;
        padding: 5px;
        .msg {
            &:not(:first-child) {
                margin-top: 5px;
            }
            &.own-msg {
                .author {
                    margin-left: auto;
                    margin-right: 5px;
                }
                .msg-box {
                    margin-left: auto;
                    background-color: hsl(236, 90%, 51%);
                }
            }
            .author {
                display: block;
                width: fit-content;
                font-size: 10px;
                margin-left: 5px;
            }
            .msg-box {
                padding: 5px 10px;
                border-radius: 10px;
                width: fit-content;
                max-width: calc(160px);
                background-color: #888;
                color: white;
                text-align: left;
                font: 400 13.3333px Arial;
                overflow-wrap: break-word;
                white-space: pre-wrap;
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
        #char-counter {
            position: absolute;
            right: 10px;
            top: 0;
            height: fit-content;
            bottom: 2px;
            margin-top: auto;
            margin-bottom: auto;
            opacity: 0.5;
        }
    }
    #bottom-container {
        display: flex;
        align-items: stretch;
        outline: 1px solid black;
    }
    #send {
        flex-grow: 1;
    }
</style>
