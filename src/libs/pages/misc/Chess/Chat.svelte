<script lang="ts">
    import type { Socket } from "socket.io-client";
    export let socket: Socket = undefined;
    export let connected = false;
    let msgareatext = "";
    $: trimmedText = msgareatext.trim();
    $: remainingChars = 200 - trimmedText.length;
    $: if(connected) {
        socket.on('emit-message',(msg)=>console.log("You got the following message:", msg))
    }
    function sendMessage() {
        socket.emit("sendMessage", trimmedText);
        msgareatext = "";
    }
</script>
<div id="container">
    <button
        disabled={trimmedText.length < 1 || trimmedText.length > 200}
        on:click={sendMessage}>Send</button
    ><br />
    <div id="text-container">
        <textarea name="msg-area" id="msg-area" cols="30" rows="10" bind:value={msgareatext} />
        <span
            style="color: {remainingChars > 20
                ? 'rgba(0, 127, 0)'
                : remainingChars > 0
                ? 'rgba(255, 120, 32)'
                : 'rgba(255, 0, 0)'};">{remainingChars}</span
        >
    </div>
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
