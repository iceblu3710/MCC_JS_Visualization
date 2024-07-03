const DOM_1 = `
    <div class="container">
        <div class="Asset-List">
            <div id="sections">
            </div>
        </div>
        <div class="File-Info">
            <div id="file-info"></div>
        </div>
        <div class="action-buttons">
            <div>
                <input type="file" id="file-input" accept=".xlsx" hidden/>
                <label for="file-input" class="button">LOAD FILE</label>
            </div>
            <div>
                <label id="load-button" class="button">LOAD ITEM</label>
            </div>
            <div>
                <label id="exit-button" class="button">CLOSE APP</label>
            </div>
        </div>
        <div class="Footer"></div>
        <div class="Header">
            <div id="app-name">
                <p>Load &amp; Control Center Manager</p>
            </div>
        </div>
    </div>
`;

function load_DOM_1(){
    disable_css();
    document.getElementById('workspace').innerHTML = DOM_1;
    document.getElementById("DOM_1_CSS").disabled = false;
}
