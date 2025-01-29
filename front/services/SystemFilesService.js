import { Directory } from '../models/Directory.js';
import System from '../models/System.js';
import {File}  from '../models/Files.js'
class FileSystemService {
    constructor(currentDir) {
        this.System = new System();
        this.rootDir = this.System.root;
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
        this.root.commandHistory.push(command);
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
    touch(name){
        if(this.currentDir.content[name]){
            throw new Error(`File ${name} already exists`);
        }
        this.currentDir.content[name] = new File(name,null,".txt",this.currentDir)
    }
    //adicionar ou reescrever conteúdo em um arquivo 
    //echo "conteudo" > arquivo.txt
    echo(text,file){
        const file = this.currentDir.content[file.name];
        if(!file){
            throw new Error(`File ${filename} not found`);
        }
        if(!(file instanceof File)){
            throw new Error(`${filename} is not a instanceof file`);
        }
        //se o arquivo está vazio
        if(!file.content){
            file.content = text;
        }else{
            file.content += text;
        }
        //simulação de tamanho de arquivo
        file.size = file.content.length*8;

        
    }
}

console.log("Hello World!");
const app = new FileSystemService(new Directory("C:/",null));
app.touch("caique")
console.log(app.currentDir.content);


console.log(new FileSystemService().parsePath("/home/user/Downloads")); // [ 'home', 'user', 'Downloads' ]