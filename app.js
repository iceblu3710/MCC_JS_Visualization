let currentFile = null;
let panelsData = {};
let entriesData = [];
let panelSelection = null;


function app_init() {
    load_DOM_1();
    DOM_1_Running();
}

function disable_css() {
    function enableStylesheet (node) {
        node.disabled = false;
    }
    
    function disableStylesheet (node) {
        node.disabled = true;
    }
      
    let css_avali = document.querySelectorAll('link[rel=stylesheet].alternate');
    css_avali.forEach(disableStylesheet);
    
}

function DOM_1_Running() { // Landing Page
    const panelSelect = document.getElementById('panel-select');
    document.getElementById('file-input').addEventListener('change', handleFileSelect, false);

    async function handleFileSelect(e) {
        currentFile = e.target.files[0];
        let reader = new FileReader();
        await handleXLSX(currentFile);
        displayFileInfo(currentFile);
        populateMenu(panelsData);
        checkForDuplicates(entriesData);
    }

    document.getElementById('load-button').addEventListener('click', loadSelection, false);

    function loadSelection(e) {
        panelSelection = document.getElementById('panel-select').value;
        load_DOM_2();
        DOM_2_Running();
    }
}

function DOM_2_Running() { // Content display
    const panelSelect = document.getElementById('panel-select');
    if (panelsData && Object.keys(panelsData).length > 0) {
        populateMenu(panelsData);
        handlePanelSelect({ target: { value: panelSelection } });
    } else {
        console.error("panelsData is not properly initialized.");
    }

    document.getElementById('panel-select').addEventListener('change', handlePanelSelect, false);

    // Add event listener for populated cells
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('populated-cell') || event.target.classList.contains('spare-cell')) {
            const infoPanel = document.getElementById('info-panel');
            const cellData = event.target.dataset.entry;
            const entry = JSON.parse(cellData);
            let infoContent = '';

            for (const [key, value] of Object.entries(entry)) {
                if (value) {
                    infoContent += `<p id=${key}>${key}:</p><p>&nbsp;&nbsp;${value}</p><br>`;
                }
            }


            infoPanel.innerHTML = infoContent;
            infoPanel.classList.add('open');
        }
        li.addEventListener('click', function() {
            // Remove 'active' class from all li elements
            document.querySelectorAll('#sections li').forEach(item => {
                item.classList.remove('active');
            });
            // Add 'active' class to the clicked li element
            li.classList.add('active');
        });
    });

    // Add event listener to close the info panel when clicking outside of it
    document.addEventListener('click', function(event) {
        const infoPanel = document.getElementById('info-panel');
        if (!infoPanel.contains(event.target) && !event.target.classList.contains('populated-cell')  && !event.target.classList.contains('spare-cell')) {
            infoPanel.classList.remove('open');
        }
    });


    function handlePanelSelect(event) {
        const selectedPanelId = event.target.value;
        const panel = panelsData ? panelsData[selectedPanelId] : null;
        const tablesContainer = document.getElementById('tables-container');
        tablesContainer.innerHTML = ''; // Clear existing table

        if (panel) {
            let table;
            if (panel.tag.startsWith('PNL')) {
                table = createPNLTable(panel.panelId, panel.floor, panel.rows);
                tablesContainer.appendChild(table);
                populatePNLTable(entriesData, panel.panelId);
            } else if (panel.tag.startsWith('MCC')) {
                table = createMCCTable(panel.panelId, panel.floor, panel.rows, panel.columns);
                tablesContainer.appendChild(table);
                populateMCCTable(entriesData, panel.panelId);
            }
            else {
                return;
            }
        }
    }

    function createMCCTable(panelId, floor, rows, columns) {
        const table = document.createElement('table');
        table.id = `panel-${panelId}`;
        table.className = 'mcc-table';
        table.border = '1';

        // Create the panel header row
        const headerRow = table.insertRow();
        headerRow.appendChild(document.createElement('th')) // Empty corner cell
        const headerCell = document.createElement('th');
        headerCell.colSpan = columns + 1;  // Including the row header column
        headerCell.innerHTML = `<b>${panelId} - ${floor}</b>`;
        headerRow.appendChild(headerCell);

        // Create column header row
        const columnHeaderRow = table.insertRow();
        columnHeaderRow.appendChild(document.createElement('th')) // Empty corner cell
        for (let col = 1; col <= columns; col++) {
            const cell = document.createElement('th');
            cell.innerHTML = col;
            columnHeaderRow.appendChild(cell);
        }

        // Create the rest of the table
        for (let row = 1; row <= rows; row++) {
            const tableRow = table.insertRow();
            const rowHeader = tableRow.insertCell();
            rowHeader.innerHTML = row;
            for (let col = 1; col <= columns; col++) {
                tableRow.insertCell();
            }
        }

        return table;
    }

    function populateMCCTable(entriesData, panelId) {
        const table = document.getElementById(`panel-${panelId}`);
        entriesData.forEach(entry => {
            if (entry.MCC_PNL === panelId) {
                const position = parseInt(entry.MCC_Position);
                const spaceSpan = parseInt(entry.MCC_Space);
                const section = parseInt(entry.MCC_Section);
                const tag = entry.TAG;
                const description = entry.Description;

                const row = table.rows[position + 1];
                const cell = row.cells[section];
                if (cell) {
                    cell.rowSpan = spaceSpan;
                    cell.innerHTML = `<b>${tag}</b><br>${description}`;
                    cell.classList.add('populated-cell');
                    if (tag === "Spare") {
                        cell.classList.add('spare-cell');
                    }
                    cell.dataset.entry = JSON.stringify(entry);
                }

                // Safe removal of cells in subsequent rows that are spanned by this entry
                for (let i = 1; i < spaceSpan; i++) {
                    const spanRow = table.rows[position + 1 + i];
                    if (spanRow && spanRow.cells.length > section) {
                        spanRow.cells[section].style.display = 'none';
                    }
                }
            }
        });
    }

    function populatePNLTable(entriesData, panelId) {
        const table = document.getElementById(`panel-${panelId}`);
        entriesData.forEach(entry => {
            if (entry.MCC_PNL === panelId) {
                const position = parseInt(entry.MCC_Position);
                const spaceSpan = parseInt(entry.MCC_Space);
                const tag = entry.TAG;
                const description = entry.Description;

                // Determine the row and column based on the position
                const rowIdx = Math.floor((position - 1) / 2) + 1;
                const colIdx = (position % 2 === 1) ? 1 : 2;

                const row = table.rows[rowIdx];
                const cell = row.cells[colIdx];
                if (cell) {
                    cell.rowSpan = spaceSpan;
                    cell.innerHTML = `<b>${tag}</b>`;
                    cell.dataset.entry = JSON.stringify(entry);
                    cell.classList.add('populated-cell');
                }

                // Safe removal of cells in subsequent rows that are spanned by this entry
                for (let i = 1; i < spaceSpan; i++) {
                    const spanRow = table.rows[rowIdx + i];
                    if (spanRow && spanRow.cells.length > colIdx) {
                        spanRow.cells[colIdx].style.display = 'none';
                    }
                }
            }
        });
    }

    function createPNLTable(panelId, floor, rows) {
        rows = rows / 2; // Two columns sum to rows
        const table = document.createElement('table');
        table.id = `panel-${panelId}`;
        table.className = 'pnl-table';
        table.border = '1';

        // Create the panel header row
        const headerRow = table.insertRow();
        headerRow.appendChild(document.createElement('th')) // Empty corner cell
        const headerCell = document.createElement('th');
        headerCell.colSpan = 2;  // 2 columns
        headerCell.innerHTML = `<b>${panelId} - ${floor}</b>`;
        headerRow.appendChild(headerCell);
        headerRow.appendChild(document.createElement('th')) // Empty corner cell

        // Create the rest of the table
        for (let row = 1; row <= rows; row++) {
            const tableRow = table.insertRow();
            for (let col = 1; col <= 4; col++) {
                const cell = tableRow.insertCell();
                if (col === 1) {
                    cell.innerHTML = row * 2 - 1; // Odd values
                } else if (col === 4) {
                    cell.innerHTML = row * 2; // Even values
                }
            }
        }

        return table;
    }   
}

function checkForDuplicates(Data) {
    const seenTags = new Set();
    const seenPositions = {};
    const duplicateMessages = [];

    Data.forEach(entry => {
        // Check for duplicate TAGs
        if (seenTags.has(entry.TAG)) {
            if (!entry.TAG === '' || !entry.TAG === 'Spare') {
                duplicateMessages.push(`Duplicate TAG: ${entry.TAG}`);
            }
        }
        seenTags.add(entry.TAG);

        // Check for duplicate MCC_Position and MCC_Section pairs within the same MCC_PNL
        const panelKey = entry.MCC_PNL;
        const positionKey = `${entry.MCC_Position}:${entry.MCC_Section}`;

        if (!seenPositions[panelKey]) {
            seenPositions[panelKey] = new Set();
        }

        if (seenPositions[panelKey].has(positionKey)) {
            duplicateMessages.push(`Duplicate ${panelKey}: TAG ${entry.TAG} MCC_Position ${entry.MCC_Position} MCC_Section ${entry.MCC_Section}`);
        }
        seenPositions[panelKey].add(positionKey);
    });

    console.log(duplicateMessages.join('\n'));
}


function processData(data) {
    panelsData = {};
    entriesData = [];

    // Separate panel data and entries data
    data.forEach(row => {
        if (row.TAG === 'MCC') {
            if (!panelsData[row.MCC_PNL]) {
                panelsData[row.MCC_PNL] = {
                    tag: row.TAG,
                    panelId: row.MCC_PNL,
                    floor: row.MCC_Floor,
                    rows: row.MCC_Space,
                    columns: row.MCC_Section
                };
            }
        }
        else if (row.TAG === 'PNL') {
            if (!panelsData[row.MCC_PNL]) {
                panelsData[row.MCC_PNL] = {
                    tag: row.TAG,
                    panelId: row.MCC_PNL,
                    floor: row.MCC_Floor,
                    rows: row.MCC_Space,
                };
            }
        } else {
            entriesData.push(row);
        }
    });
}


function populateMenuX(panels) {
    const panelSelect = document.getElementById('panel-select');
    panelSelect.innerHTML = ''; // Clear existing options

    var op = document.createElement("option");
    op.text = "Select A Panel";
    panelSelect.add(op);
    
    Object.keys(panels).forEach(panelId => {
        const option = document.createElement('option');
        option.value = panelId;
        option.text = panelId;
        panelSelect.appendChild(option);
    });
}

function populateMenu(panels) {
    const panelSelect = document.getElementById('sections');
    panelSelect.innerHTML = ''; // Clear existing options

    var ul = document.createElement('ul');
    panelSelect.appendChild(ul);
    
    Object.entries(panels).forEach(([panelId, { tag }]) => {
        var li = document.createElement('li');
        li.setAttribute('class', panelId);
        li.innerText = tag + ' '+ panelId;
        ul.appendChild(li);
    });
}


async function handleXLSX(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function(e) {
            let data = e.target.result;
            const readtype = {type: 'array', dense: true, WTF: 1 };
            data = e.target.result;

            if(e.target.result.length > 1e6) {
                if (!confirm('The file is large and may take some time to process. Do you want to continue?')) {
                    reject('File too large');
                    return;
                }
            }

            try {
                const wb = XLSX.read(data, readtype);
                const sheetName = wb.SheetNames[0];
                const worksheet = wb.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

                // Convert the array of arrays to an array of objects
                const headers = jsonData[0];
                const processedData = jsonData.slice(1).map(row => {
                    let obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });

                processData(processedData);
                resolve();
            } catch(e) {
                console.log(e); 
                alert('Failed to process the file: ' + e.message);
                reject(e);
            }
        };

        reader.readAsArrayBuffer(file);
    });
}


function displayFileInfo(file) {
    const fileInfoDiv = document.getElementById('file-info');
    if (file) {
        const fileDetails = `
            <strong>File Name:</strong> ${file.name}<br>
            <strong>File Size:</strong> ${file.size} bytes<br>
            <strong>File Type:</strong> ${file.type}<br>
            <strong>Last Modified:</strong> ${new Date(file.lastModified).toLocaleString()}
        `;
        fileInfoDiv.innerHTML = fileDetails;
    } else {
        fileInfoDiv.innerHTML = '';
    }
}
