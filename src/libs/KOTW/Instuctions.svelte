<script lang="ts">
    import type { Instruction } from "./instructions";
    export let instrs: Instruction[];

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

<ul>
    {#each instrs as instr}
        <li>
            {InstrToText(instr)}
            {#if hasOwnProperty(instr, "children")}
                <svelte:self instrs={instr.children} />
            {/if}
        </li>
    {/each}
</ul>
