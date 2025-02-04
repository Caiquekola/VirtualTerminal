package com.filesystem.service;

import com.filesystem.model.Directory;
import com.filesystem.model.File;
import com.filesystem.model.FileSystem;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileSystemService {
    private final FileSystem fileSystem;

    public FileSystemService() {
        this.fileSystem = new FileSystem();
    }

    public void mkdir(String name) {
        fileSystem.getCurrentDirectory().addDirectory(name);
        fileSystem.addToHistory("mkdir " + name);
    }

    public void rmdir(String name) {
        fileSystem.getCurrentDirectory().remove(name);
        fileSystem.addToHistory("rmdir " + name);
    }

    public String tree() {
        fileSystem.addToHistory("tree");
        return fileSystem.getCurrentDirectory().getTree("");
    }

    public void rename(String oldName, String newName) {
        fileSystem.getCurrentDirectory().rename(oldName, newName);
        fileSystem.addToHistory("rename " + oldName + " " + newName);
    }

    public List<String> ls() {
        fileSystem.addToHistory("ls");
        return new ArrayList<>(fileSystem.getCurrentDirectory().getContents());
    }

    public List<Map<String, Object>> lsDetailed() {
        fileSystem.addToHistory("ls -l");
        return fileSystem.getCurrentDirectory().getDetailedContents();
    }

    public void touch(String name, String extension) {
        File file = new File(name, "", extension, fileSystem.getCurrentDirectory());
        fileSystem.getCurrentDirectory().addFile(file);
        fileSystem.addToHistory("touch " + name + "." + extension);
    }

    public void echo(String fileName, String content, boolean append) {
        Object obj = fileSystem.getCurrentDirectory().getContent(fileName);
        if (!(obj instanceof File)) {
            throw new IllegalArgumentException("File not found: " + fileName);
        }
        File file = (File) obj;
        String newContent = append ? file.getContent() + content : content;
        File newFile = new File(file.getName(), newContent, file.getExtension(), fileSystem.getCurrentDirectory());
        fileSystem.getCurrentDirectory().remove(fileName);
        fileSystem.getCurrentDirectory().addFile(newFile);
        fileSystem.addToHistory("echo " + (append ? ">>" : ">") + " " + fileName);
    }

    public String cat(String fileName) {
        Object obj = fileSystem.getCurrentDirectory().getContent(fileName);
        if (!(obj instanceof File)) {
            throw new IllegalArgumentException("File not found: " + fileName);
        }
        fileSystem.addToHistory("cat " + fileName);
        return ((File) obj).getContent();
    }

    public void rm(String name) {
        fileSystem.getCurrentDirectory().remove(name);
        fileSystem.addToHistory("rm " + name);
    }

    public List<String> head(String fileName, int lines) {
        Object obj = fileSystem.getCurrentDirectory().getContent(fileName);
        if (!(obj instanceof File)) {
            throw new IllegalArgumentException("File not found: " + fileName);
        }
        File file = (File) obj;
        fileSystem.addToHistory("head " + fileName + " " + lines);
        return file.getLines().stream().limit(lines).collect(Collectors.toList());
    }

    public List<String> tail(String fileName, int lines) {
        Object obj = fileSystem.getCurrentDirectory().getContent(fileName);
        if (!(obj instanceof File)) {
            throw new IllegalArgumentException("File not found: " + fileName);
        }
        File file = (File) obj;
        List<String> allLines = file.getLines();
        fileSystem.addToHistory("tail " + fileName + " " + lines);
        return allLines.subList(Math.max(0, allLines.size() - lines), allLines.size());
    }

    public Map<String, Integer> wc(String fileName) {
        Object obj = fileSystem.getCurrentDirectory().getContent(fileName);
        if (!(obj instanceof File)) {
            throw new IllegalArgumentException("File not found: " + fileName);
        }
        File file = (File) obj;
        fileSystem.addToHistory("wc " + fileName);
        Map<String, Integer> counts = new HashMap<>();
        counts.put("lines", file.getLineCount());
        counts.put("words", file.getWordCount());
        counts.put("chars", file.getCharCount());
        return counts;
    }

    public void cd(String path) {
        if (path.equals("/")) {
            fileSystem.setCurrentDirectory(fileSystem.getRoot());
        } else if (path.equals("..")) {
            Directory parent = fileSystem.getCurrentDirectory().getParent();
            if (parent != null) {
                fileSystem.setCurrentDirectory(parent);
            }
        } else {
            Object obj = fileSystem.getCurrentDirectory().getContent(path);
            if (!(obj instanceof Directory)) {
                throw new IllegalArgumentException("Directory not found: " + path);
            }
            fileSystem.setCurrentDirectory((Directory) obj);
        }
        fileSystem.addToHistory("cd " + path);
    }

    public String pwd() {
        fileSystem.addToHistory("pwd");
        List<String> path = new ArrayList<>();
        Directory current = fileSystem.getCurrentDirectory();
        while (current != null) {
            path.add(0, current.getName());
            current = current.getParent();
        }
        return String.join("/", path);
    }

    public List<String> find(String name) {
        fileSystem.addToHistory("find -name " + name);
        return fileSystem.getCurrentDirectory().find(name);
    }

    public List<String> grep(String fileName, String term) {
        Object obj = fileSystem.getCurrentDirectory().getContent(fileName);
        if (!(obj instanceof File)) {
            throw new IllegalArgumentException("File not found: " + fileName);
        }
        File file = (File) obj;
        fileSystem.addToHistory("grep " + term + " " + fileName);
        return file.getLines().stream()
                .filter(line -> line.contains(term))
                .collect(Collectors.toList());
    }

    public void chmod(String name, String permissions) {
        Object obj = fileSystem.getCurrentDirectory().getContent(name);
        if (obj == null) {
            throw new IllegalArgumentException("Item not found: " + name);
        }
        if (obj instanceof File) {
            ((File) obj).setPermissions(permissions);
        } else {
            ((Directory) obj).setPermissions(permissions);
        }
        fileSystem.addToHistory("chmod " + permissions + " " + name);
    }

    public void chown(String name, String owner) {
        Object obj = fileSystem.getCurrentDirectory().getContent(name);
        if (obj == null) {
            throw new IllegalArgumentException("Item not found: " + name);
        }
        if (obj instanceof File) {
            ((File) obj).setOwner(owner);
        } else {
            ((Directory) obj).setOwner(owner);
        }
        fileSystem.addToHistory("chown " + owner + " " + name);
    }

    public Map<String, Object> stat(String name) {
        Object obj = fileSystem.getCurrentDirectory().getContent(name);
        if (obj == null) {
            throw new IllegalArgumentException("Item not found: " + name);
        }
        Map<String, Object> stats = new HashMap<>();
        if (obj instanceof File) {
            File file = (File) obj;
            stats.put("type", "file");
            stats.put("size", file.getSize());
            stats.put("created", file.getCreatedAt());
            stats.put("modified", file.getModifiedAt());
            stats.put("owner", file.getOwner());
            stats.put("permissions", file.getPermissions());
        } else {
            Directory dir = (Directory) obj;
            stats.put("type", "directory");
            stats.put("size", dir.calculateSize());
            stats.put("created", dir.getCreatedAt());
            stats.put("modified", dir.getModifiedAt());
            stats.put("owner", dir.getOwner());
            stats.put("permissions", dir.getPermissions());
        }
        fileSystem.addToHistory("stat " + name);
        return stats;
    }

    public long du(String name) {
        Object obj = fileSystem.getCurrentDirectory().getContent(name);
        if (obj == null) {
            throw new IllegalArgumentException("Item not found: " + name);
        }
        long size = obj instanceof File ? ((File) obj).getSize() : ((Directory) obj).calculateSize();
        fileSystem.addToHistory("du " + name);
        return size;
    }

    public void cp(String source, String destination) {
        // Implementation for copy operation
        fileSystem.addToHistory("cp " + source + " " + destination);
    }

    public void mv(String source, String destination) {
        // Implementation for move operation
        fileSystem.addToHistory("mv " + source + " " + destination);
    }

    public List<String> diff(String file1, String file2) {
        Object obj1 = fileSystem.getCurrentDirectory().getContent(file1);
        Object obj2 = fileSystem.getCurrentDirectory().getContent(file2);
        if (!(obj1 instanceof File) || !(obj2 instanceof File)) {
            throw new IllegalArgumentException("Both arguments must be files");
        }
        File f1 = (File) obj1;
        File f2 = (File) obj2;
        fileSystem.addToHistory("diff " + file1 + " " + file2);
        
        List<String> differences = new ArrayList<>();
        List<String> lines1 = f1.getLines();
        List<String> lines2 = f2.getLines();
        
        int i = 0;
        while (i < Math.max(lines1.size(), lines2.size())) {
            if (i >= lines1.size()) {
                differences.add("+ " + lines2.get(i));
            } else if (i >= lines2.size()) {
                differences.add("- " + lines1.get(i));
            } else if (!lines1.get(i).equals(lines2.get(i))) {
                differences.add("- " + lines1.get(i));
                differences.add("+ " + lines2.get(i));
            }
            i++;
        }
        return differences;
    }

    public void zip(String zipName, List<String> items) {
        // Simulated zip operation
        fileSystem.addToHistory("zip " + zipName + " " + String.join(" ", items));
    }

    public void unzip(String zipName) {
        // Simulated unzip operation
        fileSystem.addToHistory("unzip " + zipName);
    }

    public List<String> getCommandHistory() {
        return fileSystem.getCommandHistory();
    }
}