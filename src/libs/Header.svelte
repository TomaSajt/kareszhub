<header>
    <div id="logo">
        <div id="border">
            <a href="/">Kareszhub</a>
        </div>
    </div>
    <nav>
        <ul class="flex">
            <li>
                <img src="favicon.png" alt="Karesz" />
            </li>
            <li>
                <img src="favicon.png" alt="Karesz" />
            </li>
            <li>
                <img src="favicon.png" alt="Karesz" />
            </li>
        </ul>
    </nav>
</header>

<style lang="scss">
    header {
        border-bottom: 1px solid lightgray;
        padding: 10px 5px;
        div#logo {
            div#border {
                display: grid;
                place-items: center;
                padding: 5px;
                border: #1020f3 3px solid;
                border-radius: 30px;
                width: 150px;
                height: 60px;
                a {
                    font-size: 20px;
                    font-weight: bold;
                    text-decoration: none;
                    color: #1020f3;
                    text-align: center;
                }
            }
        }
        nav {
            margin-top: 5px;
            ul {
                margin: 0;
                padding: 0;
                list-style: none;
                display: flex;
                justify-content: space-between;
                li {
                    img {
                        width: 100px;
                        image-rendering: pixelated;
                    }
                }
            }
        }
    }
</style>
