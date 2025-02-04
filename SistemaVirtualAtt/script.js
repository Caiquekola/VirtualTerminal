// Window Management
let activeWindow = null;
let windows = {};
let currentPath = '/';


// Initialize windows positions
document.addEventListener('DOMContentLoaded', () => {
    windows = {
        fileExplorer: document.getElementById('fileExplorer'),
        terminal: document.getElementById('terminal')
    };

    // Set initial positions
    positionWindow(windows.fileExplorer, 100, 100);
    positionWindow(windows.terminal, 150, 150);

    // Make windows draggable
    Object.values(windows).forEach(makeWindowDraggable);
});

function makeWindowDraggable(windowElement) {
    const header = windowElement.querySelector('.window-header');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        initialX = e.clientX - windowElement.offsetLeft;
        initialY = e.clientY - windowElement.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            windowElement.style.left = currentX + 'px';
            windowElement.style.top = currentY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function positionWindow(windowElement, left, top) {
    windowElement.style.left = left + 'px';
    windowElement.style.top = top + 'px';
}

function activateWindow(windowElement) {
    if (activeWindow) {
        activeWindow.style.zIndex = '1';
    }
    windowElement.style.zIndex = '2';
    activeWindow = windowElement;
}

// File Explorer Functions
function openFileExplorer() {
    windows.fileExplorer.classList.add('active');
    activateWindow(windows.fileExplorer);
    updateFileExplorer();
}

function closeFileExplorer() {
    windows.fileExplorer.classList.remove('active');
}

function updateFileExplorer() {
    fetch('/api/fs/ls-l')
        .then(response => response.json())
        .then(items => {
            const content = document.getElementById('fileExplorerContent');
            content.innerHTML = '';
            
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'file-item';
                
                const icon = document.createElement('i');
                icon.className = item.type === 'directory' 
                    ? 'fas fa-folder' 
                    : getFileIcon(item.name);
                
                const name = document.createElement('span');
                name.textContent = item.name;
                
                itemElement.appendChild(icon);
                itemElement.appendChild(name);
                
                itemElement.onclick = () => handleItemClick(item);
                
                content.appendChild(itemElement);
            });
        });
}

function getFileIcon(filename) {
    if (filename.endsWith('.txt')) return 'fas fa-file-alt';
    if (filename.endsWith('.zip')) return 'fas fa-file-archive';
    return 'fas fa-file';
}

function handleItemClick(item) {
    if (item.type === 'directory') {
        fetch('/api/fs/cd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: item.name })
        })
        .then(() => {
            currentPath += item.name + '/';
            document.getElementById('currentPath').textContent = currentPath;
            updateFileExplorer();
        });
    }
}

function navigateUp() {
    if (currentPath === '/') return;
    
    fetch('/api/fs/cd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '..' })
    })
    .then(() => {
        currentPath = currentPath.split('/').slice(0, -2).join('/') + '/';
        document.getElementById('currentPath').textContent = currentPath;
        updateFileExplorer();
    });
}

// Terminal Functions
function openTerminal() {
    
    windows.terminal.classList.add('active');
    activateWindow(windows.terminal);
    document.getElementById('terminalInput').focus();
}

function closeTerminal() {
    windows.terminal.classList.remove('active');
}

function handleTerminalInput(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const command = input.value.trim();
        
        if (command === '') return;
        
        // Add command to output
        const outputDiv = document.getElementById('terminalOutput');
        outputDiv.innerHTML += `<div>C:\\>${command}</div>`;
        
        // Process command
        processCommand(command)
            .then(output => {
                outputDiv.innerHTML += `<div class="command-output">${output}</div>`;
                outputDiv.scrollTop = outputDiv.scrollHeight;
            })
            .catch(error => {
                outputDiv.innerHTML += `<div class="command-output" style="color: red;">Error: ${error.message}</div>`;
                outputDiv.scrollTop = outputDiv.scrollHeight;
            });
        
        input.value = '';
    }
}

async function processCommand(command) {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    
    switch (cmd) {
        case 'dir':
        case 'ls':
            const response = await fetch('/api/fs/ls-l');
            const items = await response.json();
            return items.map(item => 
                `${item.type.padEnd(10)} ${item.size || '<DIR>'.padEnd(8)} ${item.name}`
            ).join('\n');
            
        case 'cd':
            if (parts.length < 2) return 'Current directory: ' + currentPath;
            await fetch('/api/fs/cd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: parts[1] })
            });
            currentPath = parts[1] === '/' ? '/' : currentPath + parts[1] + '/';
            return `Changed directory to: ${currentPath}`;
            
        case 'mkdir':
            if (parts.length < 2) return 'Usage: mkdir <directory_name>';
            await fetch('/api/fs/mkdir/' + parts[1], { method: 'POST' });
            return `Directory created: ${parts[1]}`;
            
        case 'type':
        case 'cat':
            if (parts.length < 2) return 'Usage: type <file_name>';
            const content = await fetch('/api/fs/cat/' + parts[1]);
            return await content.text();
            
        case 'del':
        case 'rm':
            if (parts.length < 2) return 'Usage: del <file_name>';
            await fetch('/api/fs/rm/' + parts[1], { method: 'DELETE' });
            return `Deleted: ${parts[1]}`;
            
        case 'tree':
            const tree = await fetch('/api/fs/tree');
            return await tree.text();
            
        case 'help':
            return `Available commands:
dir, ls        - List directory contents
cd <dir>      - Change directory
mkdir <dir>    - Create directory
type, cat      - Display file contents
del, rm        - Delete file
tree           - Display directory structure
help           - Show this help`;
            
        default:
            return `'${cmd}' is not recognized as an internal command`;
    }
}

// Initialize
document.addEventListener('click', (e) => {
    if (e.target.closest('.window')) {
        activateWindow(e.target.closest('.window'));
    }
});