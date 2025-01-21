class Directory {
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
        this.directories = {};
        this.files = {};
    }

    addDirectory(directory) {
        this.directories[directory] = directory;
    }

    addFile(file) {
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
