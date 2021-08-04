<script lang="ts">
    import { tick } from "svelte";

    import * as Roland from "../../libs/pages/misc/roblib";

    let circle: HTMLDivElement;
    let inited = false;
    let started = false;
    let centerDeadArea = 0.22;
    let outerDeadArea = 0.8;
    let debug = false;
    const speedScale = 100;
    let mousedown = false;
    let axes = {
        x: 0,
        y: 0,
    };
    $: polar = {
        angle: Math.atan2(axes.y, axes.x),
        arg: Math.min(1, Math.sqrt(axes.x * axes.x + axes.y * axes.y)),
    };

    $: deadPolar = {
        angle: polar.angle,
        arg:
            polar.arg < centerDeadArea
                ? 0
                : polar.arg > outerDeadArea
                ? 1
                : (polar.arg - centerDeadArea) /
                  (outerDeadArea - centerDeadArea),
    };
    /*$: speed = {
        left: axes.y * (axes.x < 0 ? axes.x + 1 : 1),
        right: axes.y * (axes.x > 0 ? 1 - axes.x : 1),
    };*/
    $: usedPolar = deadPolar;
    $: speed = {
        left: usedPolar.arg * Math.cos(usedPolar.angle - Math.PI / 4),
        right: -usedPolar.arg * Math.cos(usedPolar.angle + Math.PI / 4),
    };
    $: scaledSpeed = {
        left: Math.round(speed.left * speedScale * 100) / 100,
        right: Math.round(speed.right * speedScale * 100) / 100,
    };
    $: if (inited) sendSpeedUpdate(scaledSpeed);
    function sendSpeedUpdate(speeds: { left: number; right: number }) {
        console.log(JSON.stringify(speeds));
        Roland.move(speeds);
    }
</script>

<div id="container">
    {#if started}
        <button on:click={() => (debug = !debug)}>Toggle Debug</button>
        {#if debug}
            <div id="debug">
                Axes: {JSON.stringify(axes)}
                <br />
                Polar: {JSON.stringify(polar)}
                <br />
                Dead polar: {JSON.stringify(deadPolar)}
                <br />
                Speed: {JSON.stringify(speed)}
                <br />
                Scaled speed:{JSON.stringify(scaledSpeed)}
            </div>
        {/if}
        {#if !inited}
            <h2>Loading...</h2>
            <br />
        {/if}
        <div
            id="circle"
            on:mousemove={(ev) => {
                if (!mousedown) return;
                //@ts-ignore
                var rect = ev.target.getBoundingClientRect();
                let x = ev.clientX - rect.left; //x position within the element.
                let y = ev.clientY - rect.top;
                //@ts-ignore
                axes.x = (2 * x) / rect.width - 1;
                //@ts-ignore
                axes.y = (-2 * y) / rect.height + 1;
            }}
            on:mousedown={(ev) => {
                mousedown = true;
                //@ts-ignore
                var rect = ev.target.getBoundingClientRect();
                let x = ev.clientX - rect.left; //x position within the element.
                let y = ev.clientY - rect.top;
                //@ts-ignore
                axes.x = (2 * x) / rect.width - 1;
                //@ts-ignore
                axes.y = (-2 * y) / rect.height + 1;
            }}
            on:mouseup={(ev) => {
                mousedown = false;
                axes.x = 0;
                axes.y = 0;
            }}
            bind:this={circle}
        >
            {#if debug}
                <div id="dead-outer" />
                <div
                    id="inner"
                    style="
                width: calc(100% * {outerDeadArea});
                height: calc(100% * {outerDeadArea});"
                />
                <div
                    id="dead-center"
                    style="
                width: calc(100% * {centerDeadArea});
                height: calc(100% * {centerDeadArea});"
                />
            {/if}
            <div
                id="stick"
                style="
            top: calc(50% * {1 - axes.y});
            left: calc(50% * {1 + axes.x});"
            />
        </div>
    {:else}
        <button
            on:click={async () => {
                started = true;
                Roland.init().then(() => (inited = true));
                await tick();
                circle.addEventListener("touchmove", (ev) => {
                    ev.preventDefault();
                    let touch = ev.touches[0];
                    //@ts-ignore
                    var rect = ev.target.getBoundingClientRect();
                    let x = touch.clientX - rect.left; //x position within the element.
                    let y = touch.clientY - rect.top;
                    //@ts-ignore
                    axes.x = (2 * x) / rect.width - 1;
                    //@ts-ignore
                    axes.y = (-2 * y) / rect.height + 1;
                });
                circle.addEventListener("touchstart", (ev) => {
                    ev.preventDefault();
                    let touch = ev.touches[0];
                    //@ts-ignore
                    var rect = ev.target.getBoundingClientRect();
                    let x = touch.clientX - rect.left; //x position within the element.
                    let y = touch.clientY - rect.top;
                    //@ts-ignore
                    axes.x = (2 * x) / rect.width - 1;
                    //@ts-ignore
                    axes.y = (-2 * y) / rect.height + 1;
                });
                circle.addEventListener("touchend", (ev) => {
                    axes.x = 0;
                    axes.y = 0;
                });
            }}>Connect</button
        >
    {/if}
</div>

<style>
    #container {
        font-family: monospace;
    }
    #circle {
        width: 90vmin;
        height: 90vmin;
        border-radius: 50%;
        margin: auto;
        position: relative;
        background-color: #ddd;
        border: 1vmin solid;
    }
    #stick {
        pointer-events: none;
        width: 20%;
        height: 20%;
        background-color: black;
        border-radius: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
    }
    #dead-center {
        pointer-events: none;
        background-color: lightcoral;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    #inner {
        pointer-events: none;
        background-color: #ddd;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    #dead-outer {
        pointer-events: none;
        background-color: lightcoral;
        border-radius: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
    }
    #debug {
        white-space: nowrap;
        overflow: hidden;
    }
    button {
        margin: auto;
        display: block;
        font: inherit;
        font-size: 3em;
    }
</style>
