// Gerenciamento de Janelas
let janelaAtiva = null;
let janelas = {};
let caminhoAtual = '/';
const ipBackend = 'http://localhost:8080';

// Inicializa posições das janelas
document.addEventListener('DOMContentLoaded', () => {
    janelas = {
        exploradorDeArquivos: document.getElementById('fileExplorer'),
        terminal: document.getElementById('terminal')
    };

    // Define posições iniciais
    posicionarJanela(janelas.exploradorDeArquivos, 100, 100);
    posicionarJanela(janelas.terminal, 150, 150);

    // Torna as janelas arrastáveis
    Object.values(janelas).forEach(tornarJanelaArrastavel);
});

function tornarJanelaArrastavel(elementoJanela) {
    const cabecalho = elementoJanela.querySelector('.window-header');
    let estaArrastando = false;
    let posXAtual;
    let posYAtual;
    let posXInicial;
    let posYInicial;

    cabecalho.addEventListener('mousedown', (e) => {
        estaArrastando = true;
        posXInicial = e.clientX - elementoJanela.offsetLeft;
        posYInicial = e.clientY - elementoJanela.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (estaArrastando) {
            posXAtual = e.clientX - posXInicial;
            posYAtual = e.clientY - posYInicial;
            elementoJanela.style.left = posXAtual + 'px';
            elementoJanela.style.top = posYAtual + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        estaArrastando = false;
    });
}

function posicionarJanela(elementoJanela, esquerda, topo) {
    elementoJanela.style.left = esquerda + 'px';
    elementoJanela.style.top = topo + 'px';
}

function ativarJanela(elementoJanela) {
    if (janelaAtiva) {
        janelaAtiva.style.zIndex = '1';
    }
    elementoJanela.style.zIndex = '2';
    janelaAtiva = elementoJanela;
}

// Funções do Explorador de Arquivos
function abrirExploradorDeArquivos() {
    janelas.exploradorDeArquivos.classList.add('active');
    ativarJanela(janelas.exploradorDeArquivos);
    atualizarExploradorDeArquivos();
    document.getElementById('overlay').classList.add('active');
    document.querySelector('.desktop').classList.add('blur');
}

function fecharExploradorDeArquivos() {
    janelas.exploradorDeArquivos.classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.querySelector('.desktop').classList.remove('blur');
}

function atualizarExploradorDeArquivos() {
    fetch(ipBackend + '/api/fs/ls-l')
        .then(response => response.json())
        .then(items => {
            const conteudo = document.getElementById('fileExplorerContent');
            conteudo.innerHTML = '';

            items.forEach(item => {
                const elementoItem = document.createElement('div');
                elementoItem.className = 'file-item';

                const icone = document.createElement('i');
                icone.className = item.type === 'directory'
                    ? 'fas fa-folder'
                    : obterIconeArquivo(item.name);

                const nome = document.createElement('span');
                nome.textContent = item.name;

                elementoItem.appendChild(icone);
                elementoItem.appendChild(nome);

                elementoItem.onclick = () => cliqueNoItem(item);

                conteudo.appendChild(elementoItem);
            });
        });
}

function obterIconeArquivo(nomeArquivo) {
    if (nomeArquivo.endsWith('.txt')) return 'fas fa-file-alt';
    if (nomeArquivo.endsWith('.zip')) return 'fas fa-file-archive';
    return 'fas fa-file';
}

// Clique no diretório e busca dos arquivos
function cliqueNoItem(item) {
    if (item.type === 'directory') {
        fetch(ipBackend + '/api/fs/cd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: item.name })
        })
            .then(() => {
                caminhoAtual += item.name + '/';
                document.getElementById('currentPath').textContent = caminhoAtual;
                atualizarExploradorDeArquivos();
            });
    }
}
// voltar na pasta
function navegarParaCima() {
    if (caminhoAtual === '/') return;

    fetch(`${ipBackend}/api/fs/cd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '..' })
    })
        .then(() => {
            caminhoAtual = caminhoAtual.split('/').slice(0, -2).join('/') + '/';
            document.getElementById('currentPath').textContent = caminhoAtual;
            atualizarExploradorDeArquivos();
        });
}

// Funções do Terminal
function abrirTerminal() {
    janelas.terminal.classList.add('active');
    ativarJanela(janelas.terminal);
    document.getElementById('terminalInput').focus();
    document.getElementById('overlay').classList.add('active');
    document.querySelector('.desktop').classList.add('blur');
}

function fecharTerminal() {
    janelas.terminal.classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.querySelector('.desktop').classList.remove('blur');
}



// Adição de foco quando clicado em qualquer lugar no terminal
const windowContent = document.getElementById('windowContent');
const terminalInput = document.getElementById('terminalInput');
windowContent.addEventListener('click', () => {
    terminalInput.focus();
});



function entradaTerminal(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const comando = input.value.trim();

        if (comando === '') return;

        // Adiciona comando ao output
        const outputDiv = document.getElementById('terminalOutput');
        outputDiv.innerHTML += `<div>C:\\>${comando}</div>`;

        // Processa comando
        processarComando(comando)
            .then(output => {
                outputDiv.innerHTML += `<div class="command-output">${output}</div>`;
                outputDiv.scrollTop = outputDiv.scrollHeight;
            })
            .catch(error => {
                outputDiv.innerHTML += `<div class="command-output" style="color: red;">Erro: ${error.message}</div>`;
                outputDiv.scrollTop = outputDiv.scrollHeight;
            });

        input.value = '';
    }
}

async function processarComando(comando) {
    const partes = comando.split(' ');
    const cmd = partes[0].toLowerCase();

    switch (cmd) {
        case 'dir':
        case 'ls': {
            const response = await fetch(`${ipBackend}/api/fs/ls-l`);
            const items = await response.json();
            return items.map(item =>
                `${item.type.padEnd(10)} ${item.size || '<DIR>'.padEnd(8)} ${item.name}`
            ).join('\n');
        }

        case 'cd':
            if (partes.length < 2) return 'Diretório atual: ' + caminhoAtual;
            await fetch(`${ipBackend}/api/fs/cd`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: partes[1] })
            });
            caminhoAtual = partes[1] === '/' ? '/' : caminhoAtual + partes[1] + '/';
            return `Mudou para o diretório: ${caminhoAtual}`;

        case 'mkdir':
            if (partes.length < 2) return 'Uso: mkdir <nome_do_diretório>';
            await fetch(`${ipBackend}/api/fs/mkdir/` + partes[1], { method: 'POST' });
            return `Diretório criado: ${partes[1]}`;

        case 'type':
        case 'cat':
            if (partes.length < 2) return 'Uso: type <nome_do_arquivo>';
            const conteudo = await fetch(ipBackend + '/api/fs/cat/' + partes[1]);
            return await conteudo.text();

        case 'del':
        case 'rm':
            if (partes.length < 2) return 'Uso: del <nome_do_arquivo>';
            await fetch(`${ipBackend}/api/fs/rm/` + partes[1], { method: 'DELETE' });
            return `Deletado: ${partes[1]}`;

        case 'tree': {
            const arvore = await fetch(ipBackend + '/api/fs/tree');
            return await arvore.text();
        }

        case 'help':
            return `Comandos disponíveis:
                    dir, ls        - Listar conteúdo do diretório
                    cd <dir>       - Mudar de diretório
                    mkdir <dir>    - Criar diretório
                    type, cat      - Exibir conteúdo do arquivo
                    del, rm        - Deletar arquivo
                    tree           - Exibir estrutura de diretórios
                    help           - Mostrar esta ajuda`;

        default:
            return `'${cmd}' não é reconhecido como um comando interno`;
    }
}

// Inicialização
document.addEventListener('click', (e) => {
    if (e.target.closest('.window')) {
        ativarJanela(e.target.closest('.window'));
    }
});

// Relógio e Data 
const timer = document.getElementById('timer');
const date = document.getElementById('date');
setInterval(() => {
    timer.innerHTML = new Date().toLocaleTimeString();
    date.innerHTML = new Date().toLocaleDateString();
}, 1000);

// Shutdown

const shutdownButton = document.getElementById('shutdown');
shutdownButton.addEventListener('click', () => {
    window.location.href = "https://github.com/Caiquekola/VirtualTerminal";
});

// Icone Folder

const folder = document.getElementById("folder");
const folderIcon = document.getElementById("folderIcon");
const folderIconSelected = document.getElementById("folderIconSelected");
folder.addEventListener('mouseover',()=>{
    folderIcon.style.display = "none";
    folderIconSelected.style.display = "";
    folderIconSelected.style.transform = "scale(1.05)";
});
folder.addEventListener('mouseleave',()=>{
    folderIcon.style.display = "";
    folderIconSelected.style.display = "none";
})


const prompt = document.getElementById("prompt");
prompt.addEventListener('mouseover',()=>{
    
    prompt.style.transform = "scale(1.05)";
});
prompt.addEventListener('mouseleave',()=>{
    prompt.style.transform = "";
    
})