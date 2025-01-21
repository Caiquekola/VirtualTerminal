class File{
    constructor(name, content,extension){
        this.name = name;
        this.content = content;
        this.extension = extension;
        this.size = calculateSize();
    }

    calculateSize(){
        return this.content.length;
    }

    getContent(){
        return this.content;
    }

}