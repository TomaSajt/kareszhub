<script lang="ts">
    import TowerSelector from "../libs/pages/kareszDefense/TowerSelector.svelte";
    import { onMount } from "svelte";

    abstract class Tower {
        x: number;
        y: number;
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
        abstract renderBody(): void;
        render() {
            this.renderBody();
            if (debug) this.renderDebug();
        }
        renderDebug() {
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    abstract class ShootingTower extends Tower {
        range: number;
        damage: number;
        constructor(
            x: number,
            y: number,
            range: number,
            damage: number,
            waitTime: number
        ) {
            super(x, y);
            this.range = range;
            this.damage = damage;
            setInterval(() => this.shoot(), waitTime);
        }
        shoot() {
            for (const enemy of enemies) {
                if (
                    (this.x - enemy.x) * (this.x - enemy.x) +
                        (this.y - enemy.y) * (this.y - enemy.y) <=
                    this.range * this.range
                ) {
                    enemy.health -= this.damage;
                    break;
                }
            }
        }
        renderDebug() {
            super.renderDebug();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    class Turret extends ShootingTower {
        constructor(x: number, y: number) {
            super(x, y, 100, 20, 300);
        }
        renderBody() {
            ctx.drawImage(turretImg, this.x - 37, this.y - 40, 75, 50);
        }
    }

    abstract class Enemy {
        x: number;
        y: number;
        targetCheckpoint: number;
        private _health: number;
        speed: number;
        constructor(health: number, speed: number) {
            this.x = levels[currentLevel].checkpoints[0].x;
            this.y = levels[currentLevel].checkpoints[0].y;
            this.targetCheckpoint = 1;
            this._health = health;
            this.speed = speed;
        }
        public set health(theNumber: number) {
            this._health = theNumber;
            if (theNumber <= 0) {
                removeEnemy(this);
            }
        }
        public get health() {
            return this._health;
        }
        abstract renderBody(): void;
        render() {
            this.renderBody();
            ctx.fillStyle = "red";
            ctx.fillText(this._health.toString(), this.x, this.y);
            if (debug) this.renderDebug();
        }
        renderDebug() {
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class RedWarrior extends Enemy {
        constructor() {
            super(100, 20);
        }
        renderBody() {
            ctx.drawImage(redWarriorImg, this.x - 27, this.y - 30, 75, 50);
            if (debug) this.renderDebug();
        }
    }
    class GreenWarrior extends Enemy {
        constructor() {
            super(70, 50);
        }
        renderBody() {
            ctx.drawImage(
                greenWarriorImg,
                this.x - 18,
                this.y - 16.6666,
                50,
                33.333
            );
        }
    }
    class BlueBrute extends Enemy {
        constructor() {
            super(300, 5);
        }
        renderBody() {
            ctx.drawImage(blueBruteImg, this.x - 35, this.y - 50, 74, 70);
        }
    }

    type LevelData = {
        image: string;
        checkpoints: { x: number; y: number }[];
    };

    const levels: LevelData[] = [
        {
            image: "kareszDefense/level1.png",
            checkpoints: [
                { x: 0, y: 435 },
                { x: 250, y: 435 },
                { x: 250, y: 210 },
                { x: 540, y: 210 },
                { x: 540, y: 370 },
                { x: 800, y: 370 },
            ],
        },
    ];
    let debug = false;
    let currentLevel = 0;
    let background: HTMLImageElement;
    let redWarriorImg: HTMLImageElement;
    let greenWarriorImg: HTMLImageElement;
    let blueBruteImg: HTMLImageElement;
    let turretImg: HTMLImageElement;

    const deltaTime = 0.16666;
    let enemies: Enemy[] = [];
    let towers: Tower[] = [];

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    onMount(() => {
        ctx = canvas.getContext("2d");
        ctx.lineWidth = 2;
        requestAnimationFrame(drawCanvas);
    });

    function startLevel(level: number) {
        currentLevel = level;
        enemies = [];
        towers = [];
    }

    function normalize(x: number, y: number) {
        let abs = Math.sqrt(x * x + y * y);
        return { x: x / abs, y: y / abs };
    }
    function drawCanvas() {
        let currentLevelData = levels[currentLevel];
        for (const enemy of enemies) {
            let deltaSpeed = enemy.speed * deltaTime;
            let nextCheckpoint =
                currentLevelData.checkpoints[enemy.targetCheckpoint];

            let diffX = nextCheckpoint.x - enemy.x;
            let diffY = nextCheckpoint.y - enemy.y;
            let dirVec = normalize(diffX, diffY);
            let dx = dirVec.x * deltaSpeed;
            let dy = dirVec.y * deltaSpeed;
            enemy.x += dx;
            enemy.y += dy;
            if (
                (diffX - dx) * (diffX - dx) + (diffY - dy) * (diffY - dy) <=
                deltaSpeed * deltaSpeed
            ) {
                enemy.targetCheckpoint++;
                if (
                    enemy.targetCheckpoint >=
                    currentLevelData.checkpoints.length
                ) {
                    removeEnemy(enemy);
                }
            }
        }
        enemies = enemies;

        ctx.drawImage(background, 0, 0);
        if (debug) {
            for (let i = 0; i < currentLevelData.checkpoints.length - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(
                    currentLevelData.checkpoints[i].x,
                    currentLevelData.checkpoints[i].y
                );
                ctx.lineTo(
                    currentLevelData.checkpoints[i + 1].x,
                    currentLevelData.checkpoints[i + 1].y
                );
                ctx.stroke();
            }
        }
        for (const enemy of enemies) {
            enemy.render();
        }
        for (const tower of towers) {
            tower.render();
        }
        requestAnimationFrame(drawCanvas);
    }
    function removeEnemy(enemy: Enemy) {
        const index = enemies.indexOf(enemy);
        if (index > -1) enemies.splice(index, 1);
        enemies = enemies;
    }
    function onCanvasClick(this: HTMLCanvasElement, ev: MouseEvent) {
        const rect = this.getBoundingClientRect();
        let clickX = ev.clientX - rect.left;
        let clickY = ev.clientY - rect.top;
        towers.push(new Turret(clickX, clickY));
        towers = towers;
    }
</script>

<div id="container">
    <div id="no-display">
        <img src="/kareszDefense/level1.png" alt="" bind:this={background} />
        <img
            src="/kareszDefense/red_warrior.png"
            alt=""
            bind:this={redWarriorImg}
        />
        <img
            src="/kareszDefense/green_warrior.png"
            alt=""
            bind:this={greenWarriorImg}
        />
        <img
            src="/kareszDefense/blue_brute.png"
            alt=""
            bind:this={blueBruteImg}
        />
    </div>
    <h1>Level {currentLevel + 1}</h1>
    <canvas
        bind:this={canvas}
        width={800}
        height={600}
        on:click={onCanvasClick}
    /><br />
    <TowerSelector>
        <img src="/kareszDefense/turret.png" alt="" bind:this={turretImg} />
    </TowerSelector>
    <button
        on:click={() => {
            enemies.push(new RedWarrior());
        }}>Add red warrior</button
    >
    <button
        on:click={() => {
            enemies.push(new GreenWarrior());
        }}>Add green warrior</button
    >
    <button
        on:click={() => {
            enemies.push(new BlueBrute());
        }}>Add blue brute</button
    >
    <br />
    <button
        on:click={() => {
            debug = !debug;
        }}>Toggle Debug Mode</button
    >
    <button
        on:click={() => {
            startLevel(currentLevel);
        }}>Restart</button
    >
</div>

<style lang="scss">
    #container {
        width: fit-content;
        margin: auto;
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }
    canvas {
        image-rendering: pixelated;
    }
    #no-display {
        display: none;
    }
    :not(#no-display) img {
        width: 100px;
    }
</style>
