export class File{
    constructor(name, content,extension,parent){
        this.name = name;
        this.content = content;
        this.extension = extension;
        this.parent = parent;
        this.size = 0;
    }

    calculateSize(){
        return this.content;
    }

    getContent(){
        return this.content;
    }

}