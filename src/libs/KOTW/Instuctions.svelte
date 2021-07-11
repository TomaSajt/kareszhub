<script lang="ts">
    import type { Instruction } from "./instructions";
    export let instrs: Instruction[];
    export let isGroupChild = false;

    function hasOwnProperty<X extends {}, Y extends PropertyKey>(
        obj: X,
        prop: Y
    ): obj is X & Record<Y, unknown> {
        return obj.hasOwnProperty(prop);
    }
    function InstrToText(instr: Instruction): string {
        switch (instr.name) {
            case "repeat":
                return `Repeat ${instr.times} times`;
            case "turnright":
                return `Turn right`;
            case "turnleft":
                return `Turn left`;
            case "step":
                return `Step`;
            case "place":
                return `Place ${instr.color} stone`;
            case "pickup":
                return `Pick up stone`;
        }
    }
</script>

<ul class={isGroupChild ? "group-child" : ""}>
    {#each instrs as instr (instr)}
        <li class={hasOwnProperty(instr, "children") ? "group" : "single"}>
            <span class="instr-name">{InstrToText(instr)}</span>
            {#if hasOwnProperty(instr, "children")}
                <svelte:self instrs={instr.children} isGroupChild={true} />
            {/if}
        </li>
    {/each}
</ul>

<style lang="scss">
    li {
        border: 1px solid;
        border-right: none;
        background-color: hsl(175, 58%, 47%);
    }
    li:not(:first-child) {
        border-top: none;
    }
    ul {
        padding: 0px;
        list-style: none;
    }
    .group-child {
        margin-left: 30px;
        margin-bottom: 20px;
    }
    .group {
        > .instr-name {
            margin-left: 15px;
        }
        background-color: yellow;
    }
    .instr-name {
        margin-top: 1px;
        margin-bottom: 1px;
        display: inline-block;
    }
    ul:not(.group-child) {
        width: fit-content;
        border-right: 1px solid;
    }
</style>
