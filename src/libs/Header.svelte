<header>
    <div id="logo">
        <div id="border">
            <a href="/">Kareszhub</a>
        </div>
    </div>
    <nav>
        <ul class="flex">
            <li>
                <a href="/KOTW">KOTW</a>
            </li>
            <li>
                <a href="https://kareszhub.vercel.app/kareszClicker"
                    >Karesz Clicker</a
                >
            </li>
            <li id="left-start">
                <a href="/other-stuff">Other Stuff</a>
            </li>
            <li>
                <a href="/about">About Website</a>
            </li>
        </ul>
    </nav>
</header>

<style lang="scss">
    a {
        text-decoration: none;
        color: #000;
    }
    a:hover {
        color: #1020f3;
    }
    header {
        font-size: 24px;
        border-bottom: 1px solid lightgray;
        padding: 10px 20px;
        display: flex;
        flex-wrap: wrap;
        //background-color: yellow;
        > div {
            margin-right: 20px;
        }
        nav {
            &::-webkit-scrollbar {
                $size: 3px;
                height: $size;
                width: $size;
            }
            &::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            &::-webkit-scrollbar-thumb {
                background: #777;
            }
            &::-webkit-scrollbar-thumb:hover {
                background: #aaa;
            }
            white-space: nowrap;
            //background-color: red;
            flex-grow: 1;
            overflow-x: auto;
            ul {
                margin: 0;
                padding: 0;
                list-style: none;
                display: flex;
                justify-content: flex-start;
                li:not(:first-child) {
                    margin-left: 20px;
                }
            }
        }
    }

    #left-start {
        margin-left: auto;
    }
</style>
