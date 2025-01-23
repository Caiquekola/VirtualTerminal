import { Directory } from './Directory.js';

export default class System{
    constructor(){
        this.root = new Directory("C:/",null);
        this.freeSpace = 0;
        this.totalSpace = 0;
        this.commandHistory = [];
    }
    

    getCommandHistory(){
        return this.commandHistory;
    }
}

