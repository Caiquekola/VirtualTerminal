import System from '../models/System.js';

class FileSystemService{
    constructor() {
        this.root = new System("C:", null);
    }

    // Função para dividir o caminho
    parsePath(path) {
        if (path === '/') return ['/'];
        return path.split('/').filter(p => p !== '');
      }

    /*  TODO: Funções a fazer 
    */
}



console.log (new FileSystemService().parsePath("/home/user/Downloads")); // [ 'home', 'user', 'Downloads' ]