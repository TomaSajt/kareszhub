<script lang="ts">
    import { tick } from "svelte";

    interface FileSystemHandle {
        kind: string;
        name: string;
        isSameEntry(hndl: FileSystemHandle): boolean;
        queryPermission(opts: { mode: "read" | "readwrite" }): PermissionState;
        requestPermission(opts: {
            mode: "read" | "readwrite";
        }): PermissionState;
    }
    interface FileSystemFileHandle extends FileSystemHandle {
        getFile(): Promise<File>;
        createWritable(): Promise<FileSystemWritableFileStream>;
    }
    interface FileSystemWritableFileStream extends WritableStream {
        write(data: BufferSource | Blob | string): Promise<undefined>;
        close(): Promise<void>;
    }
    interface DataTransferItemExt extends DataTransferItem {
        getAsFileSystemHandle(): Promise<FileSystemFileHandle>;
    }
    type Tab = {
        fileHandle: FileSystemFileHandle;
        text: string;
        name: string;
    };
    let tabs: Tab[] = [
        {
            fileHandle: null,
            text: "",
            name: "Unnamed 1",
        },
    ];
    let selected = 0;
    let newFileCount = 1;

    function dragOverHandler(ev: DragEvent) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
    }
    async function dropHandler(ev: DragEvent) {
        ev.preventDefault();
        const dataTransfer = ev.dataTransfer;
        const items: DataTransferItemExt[] = [];
        for (let i = 0; i < dataTransfer.items.length; i++) {
            const item = dataTransfer.items[i];
            //@ts-ignore
            if (item.kind === "file") items.push(item);
        }
        const fileHandleArr = (
            await Promise.all(items.map((item) => item.getAsFileSystemHandle()))
        ).filter((handle) => handle.kind === "file");
        for (const fileHandle of fileHandleArr) {
            await openHandle(fileHandle);
        }
    }
    async function keyDownHandler(
        this: HTMLTextAreaElement,
        ev: KeyboardEvent
    ) {
        if (ev.key == "Tab") {
            ev.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;
            this.value =
                this.value.substring(0, start) +
                "\t" +
                this.value.substring(end);
            await tick();
            this.selectionStart = this.selectionEnd = start + 1;
        }
    }
    async function open() {
        let fileHandleArr: FileSystemFileHandle[] = await window
            //@ts-ignore
            .showOpenFilePicker({
                multiple: true,
            })
            .catch(() => []);
        for (const fileHandle of fileHandleArr) {
            await openHandle(fileHandle);
        }
    }
    async function openHandle(fileHandle: FileSystemFileHandle) {
        let file: File = await fileHandle.getFile();
        let text = await file.text();
        let name = file.name;
        tabs = [...tabs, { fileHandle, text, name }];
        selected = tabs.length - 1;
    }
    async function save(saveAs: boolean) {
        let fileHandle = tabs[selected].fileHandle;
        if (saveAs || !fileHandle) {
            //@ts-ignore
            fileHandle = await window.showSaveFilePicker();
            let file = await fileHandle.getFile();
            let name = file.name;
            tabs[selected] = {
                fileHandle,
                text: tabs[selected].text,
                name,
            };
        }
        const writable = await fileHandle.createWritable();
        await writable.write(tabs[selected].text);
        await writable.close();
    }
    function newTab() {
        newFileCount++;
        tabs = [
            ...tabs,
            { fileHandle: null, text: "", name: `Unnamed ${newFileCount}` },
        ];
        selected = tabs.length - 1;
    }
    function removeTab(index: number) {
        tabs = tabs.filter((tab, i) => i !== index);
        selected = Math.min(0, tabs.length - 1);
        if (tabs.length == 0) {
            newTab();
        }
    }
</script>

<div id="container">
    <button on:click={() => newTab()}>New</button>
    <button on:click={() => open().catch()}>Open</button>
    <button on:click={() => save(false).catch()}>Save</button>
    <button on:click={() => save(true).catch()}>Save As</button>
    <div id="tabs">
        {#each tabs as tab, i}
            <span
                class="tab"
                on:click={() => (selected = i)}
                id={i == selected ? "selected" : ""}
            >
                {tab.name}
                <span class="close" on:click={() => removeTab(i)}>&#x274C;</span
                >
            </span>
        {/each}
    </div>
    <textarea
        id="editor"
        rows="30"
        on:drop={(ev) => dropHandler(ev).catch()}
        on:dragover={dragOverHandler}
        on:keydown={keyDownHandler}
        bind:value={tabs[selected].text}
    />
</div>

<style lang="scss">
    * {
        box-sizing: border-box;
    }
    #tabs {
        width: fit-content;
        max-width: 100%;
        border: 2px solid black;
        border-bottom: none;
        margin-top: 10px;
        display: flex;
        overflow-x: auto;
        &::-webkit-scrollbar {
            height: 3px;
        }
        &::-webkit-scrollbar-track {
            background: #ccc;
        }
        &::-webkit-scrollbar-thumb {
            background: #777;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #444;
        }
        .tab {
            &:not(:first-child) {
                border-left: 2px solid black;
            }
            &#selected {
                background-color: aqua;
                &:active {
                    background-color: #0de7e7;
                }
            }
            &:active {
                background-color: #999;
            }
            padding: 2px 10px;
            background-color: #aaa;
            cursor: pointer;
            white-space: nowrap;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        .close {
            padding-left: 5px;
        }
    }
    #container {
        margin: 20px;
    }
    #editor {
        &:focus {
            background-color: #fff;
        }
        width: 100%;
        display: block;
        border: 2px solid black;
        outline: none;
        background-color: #f7f7f7;
        resize: none;
        white-space: nowrap;
    }
</style>
