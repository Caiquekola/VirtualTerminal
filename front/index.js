import readline from 'readline';
import { VirtualFileSystem } from './filesystem.js';

const fs = new VirtualFileSystem();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$ '
});

function parseCommand(input) {
  const parts = input.trim().split(' ');
  const command = parts[0];
  const args = parts.slice(1);
  return { command, args };
}

async function handleCommand(input) {
  const { command, args } = parseCommand(input);
  fs.addToHistory(input);

  try {
    switch (command) {
      case 'mkdir':
        if (!args[0]) throw new Error('Directory name required');
        fs.mkdir(args[0]);
        break;

      case 'cd':
        fs.cd(args[0]);
        break;

      case 'pwd':
        console.log(fs.pwd());
        break;

      case 'ls':
        console.log(fs.ls(args[0] === '-l'));
        break;

      case 'touch':
        if (!args[0]) throw new Error('File name required');
        fs.touch(args[0]);
        break;

      case 'echo':
        const writeIndex = args.indexOf('>');
        if (writeIndex === -1) {
          console.log(args.join(' '));
          break;
        }
        
        const isAppend = args[writeIndex - 1] === '>';
        const text = args.slice(0, isAppend ? writeIndex - 1 : writeIndex).join(' ');
        const filename = args[writeIndex + 1];
        
        fs.echo(text, filename, isAppend);
        break;

      case 'cat':
        if (!args[0]) throw new Error('File name required');
        console.log(fs.cat(args[0]));
        break;

      case 'rm':
        if (!args[0]) throw new Error('File/directory name required');
        fs.rm(args[0]);
        break;

      case 'tree':
        console.log(fs.tree());
        break;

      case 'history':
        console.log(fs.history());
        break;

      case 'exit':
        console.log('Goodbye!');
        rl.close();
        process.exit(0);
        break;

      default:
        console.log(`Command not found: ${command}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

console.log('Virtual File System Simulator');
console.log('Type "exit" to quit\n');

rl.prompt();
rl.on('line', async (line) => {
  await handleCommand(line.trim());
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});