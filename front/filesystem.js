// Virtual File System implementation
export class VirtualFileSystem {
  constructor() {
    this.root = {
      name: '/',
      type: 'directory',
      content: {},
      parent: null,
      permissions: '755',
      owner: 'root',
      createdAt: new Date(),
      modifiedAt: new Date(),
      size: 0
    };
    this.currentDir = this.root;
    this.commandHistory = [];
  }

  // Helper method to parse paths
  parsePath(path) {
    if (path === '/') return ['/'];
    return path.split('/').filter(p => p !== '');
  }

  // Helper method to find a node by path
  findNode(path) {
    if (path === '/') return this.root;
    
    let current = path.startsWith('/') ? this.root : this.currentDir;
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

  // Command implementations
  mkdir(name) {
    if (this.currentDir.content[name]) {
      throw new Error(`Directory ${name} already exists`);
    }

    this.currentDir.content[name] = {
      name,
      type: 'directory',
      content: {},
      parent: this.currentDir,
      permissions: '755',
      owner: 'user',
      createdAt: new Date(),
      modifiedAt: new Date(),
      size: 0
    };
  }

  cd(path) {
    if (!path) {
      throw new Error('Path is required');
    }

    if (path === '/') {
      this.currentDir = this.root;
      return;
    }

    const target = this.findNode(path);
    if (!target) {
      throw new Error(`Directory ${path} not found`);
    }
    if (target.type !== 'directory') {
      throw new Error(`${path} is not a directory`);
    }

    this.currentDir = target;
  }

  pwd() {
    let path = [];
    let current = this.currentDir;

    while (current !== null) {
      if (current.name === '/') {
        path.unshift('');
      } else {
        path.unshift(current.name);
      }
      current = current.parent;
    }

    return path.join('/') || '/';
  }

  touch(name) {
    if (this.currentDir.content[name]) {
      throw new Error(`File ${name} already exists`);
    }

    this.currentDir.content[name] = {
      name,
      type: 'file',
      content: '',
      parent: this.currentDir,
      permissions: '644',
      owner: 'user',
      createdAt: new Date(),
      modifiedAt: new Date(),
      size: 0
    };
  }

  echo(text, filename, append = false) {
    const file = this.currentDir.content[filename];
    if (!file) {
      throw new Error(`File ${filename} not found`);
    }
    if (file.type !== 'file') {
      throw new Error(`${filename} is not a file`);
    }

    if (append) {
      file.content += text + '\n';
    } else {
      file.content = text + '\n';
    }
    
    file.modifiedAt = new Date();
    file.size = file.content.length;
  }

  cat(filename) {
    const file = this.currentDir.content[filename];
    if (!file) {
      throw new Error(`File ${filename} not found`);
    }
    if (file.type !== 'file') {
      throw new Error(`${filename} is not a file`);
    }

    return file.content;
  }

  ls(showDetails = false) {
    const entries = Object.values(this.currentDir.content);
    
    if (!showDetails) {
      return entries.map(entry => entry.name).join('  ');
    }

    return entries.map(entry => {
      const type = entry.type === 'directory' ? 'd' : '-';
      return `${type}${entry.permissions} ${entry.owner} ${entry.size} ${entry.modifiedAt.toISOString()} ${entry.name}`;
    }).join('\n');
  }

  rm(name) {
    if (!this.currentDir.content[name]) {
      throw new Error(`${name} not found`);
    }

    delete this.currentDir.content[name];
  }

  tree(node = this.root, prefix = '') {
    let result = '';
    if (node === this.root) {
      result = '/\n';
    }

    const entries = Object.values(node.content);
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const isLast = i === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      
      result += prefix + connector + entry.name + '\n';
      
      if (entry.type === 'directory') {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        result += this.tree(entry, newPrefix);
      }
    }

    return result;
  }

  addToHistory(command) {
    this.commandHistory.push(command);
    if (this.commandHistory.length > 50) {
      this.commandHistory.shift();
    }
  }

  history() {
    return this.commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
  }
}