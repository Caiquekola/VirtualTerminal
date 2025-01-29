export class Directory {
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
        //acesso pelo nome
        this.content = {};
    }

    addDirectory(directory) {
        if (!directory || !directory.name) {
            throw new Error("Invalid directory object: must have a 'name' property.");
        }
    
        if (this.content[directory.name]) {
            throw new Error(`A directory with the name '${directory.name}' already exists.`);
        }
    
        this.content[directory.name] = new Directory(directory.name, this);
    }

    addFile(file) {
        if(!file || !file.name || !file.extension) {
            throw new Error("Invalid file object: must have a 'name' or 'extension' property.");
        }

        if (this.content[file.name]) {
            throw new Error(`A file with the name '${file.name}' already exists.`);
        }

        this.files[file] = file;
    }
    
    removeDirectory(directory) {
        delete this.directories[directory];
    }

    removeFile(file) {
        delete this.files[file];
    }

    getDirectories() {
        return Object.keys(this.directories);
    }

    getFiles() {
        return Object.keys(this.files);
    }


}
