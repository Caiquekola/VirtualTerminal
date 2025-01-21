
class System{
    constructor(){
        this.id = 0;
        this.root = new Directory();
        this.freeSpace = 0.0;
        this.totalSpace = 0.0;
    }
    constructor(id, root, freeSpace, totalSpace){
        this.id = id;
        this.root = root;
        this.freeSpace = freeSpace;
        this.totalSpace = totalSpace;
    }

    
}