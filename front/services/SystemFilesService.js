import { Directory } from '../models/Directory.js';
import System from '../models/System.js';

class FileSystemService{
    constructor() {
        this.System = new System();
        this.rootDir = this.System.root;
        this.currentDir = new Directory("C:/",null)
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
    //útil para o cd
    findDir(path){
        if(path === "/") {
            this.currentDir = this.rootDir;
        }
        
        //se for só / volta para o C:/
        //senão recebe o atual
        let current = path.startsWith('/') ? this.rootDir.name : this.currentDir.name;
        const parts = this.parsePath(path);

        for(const part of parts){
            if(part === '..'){
                current = current.parent
            }
        }

    }  
}



console.log (new FileSystemService().parsePath("/home/user/Downloads")); // [ 'home', 'user', 'Downloads' ]