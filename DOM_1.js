const DOM_1 = `
    <div id="page-div">
        <div id="app-name">
            <p>Load &amp; Control Center Manager</p>
        </div>

        <div class="container">
            <div class="box">
                <div class="box-row">
                    <div id="file-info" class="box1"></div>
                    <div id="panel-list" class="box2">
                        <label>Assets Avalible</label>
                        <br>
                        <div id="select">
                            <select id="panel-select"></select>
                            <span class="focus"></span>
                        </div>
                    </div>
                    <div id="panel-load" class="box3">
                        <button id="load-button">LOAD ITEM</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="file-picker">
            <p>
                <input type="file" id="csv-input" accept=".xlsx">
            </p>
        </div>
    </div>
`;

function load_DOM_1(){
    disable_css();
    document.getElementById('workspace').innerHTML = DOM_1;
    document.getElementById("DOM_1_CSS").disabled = false;
}