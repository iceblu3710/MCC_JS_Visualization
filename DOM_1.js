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


        // <div class="container">
        //     <div class="box">
        //         <div class="box-row">
        //             <div id="file-picker">
        //                 <input type="file" id="file-input" accept=".xlsx">
        //             </div>
        //             <div id="file-info" class="box1"></div>
        //             <div id="panel-list" class="box2">
        //                 <label>Assets Avalible</label>
        //                 <br>
        //                 <div id="select">
        //                     <select id="panel-select"></select>
        //                     <span class="focus"></span>
        //                 </div>
        //             </div>
        //             
        //         </div>
        //     </div>
        // </div>