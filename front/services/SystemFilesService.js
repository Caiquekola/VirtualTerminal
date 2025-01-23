import System from '../models/System.js';

class FileSystemService{
    constructor() {
        this.root = new System();
        this.rootDir = "C:/";
        this.currentDir = "C:/";
    }

    //salva o último comando
    addCommandHistory(command){
        this.root.commandHistory.push(command);
    }

    // Função para dividir o caminho em palavras
    //Ex: C:/root/pedro/documentos 
    //result: 'root','pedro','documentos';  
    parsePath(path) {
        if (path === '/') return ['/'];
        return path.split('/').filter(p => p !== '');
    }

    //achar diretório
    findDir(path){
        if(path === "/") {
            this.currentDir = this.rootDir;
        }
        
        let current = path.startsWith('/') ? th
    }  
}



console.log (new FileSystemService().parsePath("/home/user/Downloads")); // [ 'home', 'user', 'Downloads' ]