// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);
// Create a directory
// Show directory tree
fetch('/api/fs/tree').then(response => response.text());

// Rename a file
fetch('/api/fs/rename', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ oldName: 'old.txt', newName: 'new.txt' })
});

// Show detailed directory listing
fetch('/api/fs/ls-l').then(response => response.json());

// Search for files
fetch('/api/fs/find?name=test').then(response => response.json());

// Change permissions
fetch('/api/fs/chmod', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'file.txt', permissions: 'rw-r--r--' })
});
