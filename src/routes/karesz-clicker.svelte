<script lang="ts">

    let kareszCount = 0;
    let kareszRotation = 0

    
</script>

<svelte:head>
    <title>Karesz Clicker</title>
</svelte:head>
<div id="main-grid">
    <div id="center-container">
        <img style="transform: rotate({90*kareszRotation}deg);" id="karesz" src="/Karesz2.png" alt="Karesz" on:click={()=>{kareszCount++; kareszRotation++}} draggable="false">
    </div>
    <div id="left-container">

    </div>
    <div id="right-container">

    </div>
    <div id="top-container">
        <h2 id="karesz-count">Karesz Count: {kareszCount}</h2>
    </div>
    <div id="bottom-container">

    </div>
</div>
<style lang="scss">
    #main-grid {
        display: grid;
        position: absolute;
        inset: 2%;
        min-width: 1000px;
        grid-template-columns: 1fr 2fr 1fr;
        grid-template-rows: 1fr 2fr 1fr;
        grid-template-areas: "left top right" "left center right" "left bottom right";
    }
    #center-container {
        grid-area: center;
        background-color: rgba(255, 255, 0, 0.5);
    }
    #left-container {
        grid-area: left;
        background-color: rgba(255, 0, 0, 0.5);
    }
    #right-container {
        grid-area: right;
        background-color: rgba(255, 0, 255, 0.5);
    }
    #top-container {
        grid-area: top;
        background-color: rgba(0, 255, 0, 0.5);
    }
    #bottom-container {
        grid-area: bottom;
        background-color: cyan;
    }
    #karesz {
        image-rendering: pixelated;
        display: block;
        margin: auto;
        width: 80%;
    }
    #karesz-count {
        text-align: center;
    }
</style>
