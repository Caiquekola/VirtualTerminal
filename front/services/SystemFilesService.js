import { Directory } from '../models/Directory.js';
import System from '../models/System.js';
import { File } from '../models/Files.js'
class FileSystemService {
    constructor(currentDir) {
        this.system = new System();
        this.rootDir = this.system.root;
        this.currentDir = currentDir;
    }
    //ver o nome do diretório atual
    getCurrentDirName() {
        return this.currentDir.name;
    }
    //ver o nome do diretório raiz
    getRootDirName() {
        return this.rootDir.name;
    }
    getRoot() {
        return this.rootDir;
    }
    getCurrent() {
        return this.currentDir;
    }

    //salva o último comando
    addCommandHistory(command) {
        this.system.commandHistory.push(command);
    }

    // Função para dividir o caminho em palavras
    //Ex: C:/root/pedro/documentos 
    //result: ['root','pedro','documentos'];  
    //utilizado no findDir/cd
    parsePath(path) {
        if (path === '/') return ['/'];
        return path.split('/').filter(p => p !== '');
    }

    //achar diretório
    //útil para o cd
    findDir(path) {
        if (path === "/") {
            this.currentDir = this.rootDir;
        }

        //se for só / volta para o C:/
        //senão recebe o atual
        let current = path.startsWith('/') ? this.getRoot : this.getCurrent;
        const parts = this.parsePath(path);

        for (const part of parts) {
            if (part === '..') {
                current = current.parent || current;
            } else if (part === '.') {
                continue;
            } else {
                if (!current.content[part]) return null;
                current = current.content[part];
            }
        }
        return current;
    }

    //criar diretório
    mkdir(name) {
        if (this.currentDir.content[name]) {
            throw new Error(`Directory ${name} already exists`);
        }
        this.currentDir.content[name] = new Directory(name, this.currentDir);
    }

    cd(path) {
        if (!path) {
            throw new Error("Path is required");
        }
        if (path === "/") {
            this.currentDir = this.rootDir;
            return;
        }
        const target = this.findNode(path);
        if (!target) {
            throw new Error(`Directory ${path} not found`);
        }
        //TODO
        // if (target.<className> !== 'directory') {
        //     throw new Error(`${path} is not a directory`);
        // }

        this.currentDir = target;
    }

    //Criar arquivo vazio      
    touch(name) {
        if (this.currentDir.content[name]) {
            throw new Error(`File ${name} already exists`);
        }
        this.currentDir.content[name] = new File(name, null, ".txt", this.currentDir)
    }
    //adicionar ou reescrever conteúdo em um arquivo - neste caso File já deve ter sido criado?
    //echo "conteudo" > arquivo.txt
    echo(text, filename) {
        const file = this.currentDir.content[filename];
        if (!file) {
            throw new Error(`File ${filename} not found`);
        }
        if (!(file instanceof File)) {
            throw new Error(`${filename} is not a instanceof file`);
        }
        //se o arquivo está vazio
        if (!file.content) {
            file.content = text;
        } else {
            file.content += text;
        }
        //simulação de tamanho de arquivo
        file.size = file.content.length;
    }


    //pwd - exibir o caminho do diretório atual
    //print work directory
    pwd() {
        let path = [];
        let current = this.currentDir;
        while (current !== null) {
            if (current.name === 'C:/') {
                path.unshift('');
            } else {
                path.unshift(current.name);
            }
            current = current.parent;
        }
        return path.join('/') || '/';
    }

    ls() {
        // Obtém todos os elementos do diretório atual
        const content = Object.values(this.currentDir.content);

        // Separa diretórios e arquivos
        const directories = content.filter(element => element instanceof Directory);
        const files = content.filter(element => element instanceof File);

        // Exibe os diretórios primeiro
        directories.forEach(dir => console.log(dir.name));

        // Depois, exibe os arquivos
        files.forEach(file => console.log(file.name));
    }
    //exibir texto de um arquivo
    cat(filename) {

        const file = this.currentDir.content[filename];
        if (!file) {
            throw new Error(`File ${filename} not found`);
        }
        if (file.type !== 'file') {
            throw new Error(`${filename} is not a file`);
        }

        return file.content;

    }

    //remover arquivo/diretório
    rm(name) {
        if (!this.currentDir.content[name]) {
            throw new Error(`File ${name} not found`);
        }
        delete this.currentDir.content[name];
    }
    //histórico de comandos
    history() {
        this.system.getCommandHistory().forEach((command, index) => {
            console.log(`${index + 1} ${command}`);
        });
        return this.system.commandHistory;
    }

    //exibicao em árvore
    tree(node = this.currentDir, prefix = '') {
        let result = '';
        if (node.name === this.rootDir.name) {
            result = 'C:/\n';
        }

        const entries = Object.values(node.content);
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const isLast = i === entries.length - 1;
            const connector = isLast ? '└── ' : '├── ';

            result += prefix + connector + entry.name + '\n';

            if (entry instanceof Directory) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                result += this.tree(entry, newPrefix);
            }
        }

        return result;
    }
}

export default FileSystemService;


//Inicialização do sistema
const app = new FileSystemService(new Directory("C:/", null));
//Cria arquivo
app.touch("caique")
//Exibição do caminho atual
console.log(app.currentDir.content);
app.mkdir("documentos");
console.log("mkdir", app.currentDir.content);
console.log("ls", app.ls());
console.log( app.tree());


console.log(new FileSystemService().parsePath("/home/user/Downloads")); // [ 'home', 'user', 'Downloads' ]