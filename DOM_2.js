const DOM_2 = `
    <div id="home-button">GO BACK HOME</div>
    <div id="tables-container"></div>
    <div id="info-panel" class="info-panel"></div>
`;

function load_DOM_2(){
    disable_css();
    document.getElementById('workspace').innerHTML = DOM_2;
    document.getElementById("DOM_2_CSS").disabled = false;
}