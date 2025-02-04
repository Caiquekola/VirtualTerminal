package com.filesystem.model;

import java.util.ArrayList;
import java.util.List;

public class FileSystem {
    private Directory root;
    private Directory currentDirectory;
    private List<String> commandHistory;
    //TODO implementar
    private long freeSpace;
    private long totalSpace;

    public FileSystem() {
        this.root = new Directory("/", null);
        this.currentDirectory = root;
        this.commandHistory = new ArrayList<>();
        this.totalSpace = 1024 * 1024 * 1024; // 1 KB 1 MB -> 1GB
        this.freeSpace = totalSpace;
    }

    public void addToHistory(String command) {
        commandHistory.add(command);
    }

    public List<String> getCommandHistory() {
        return new ArrayList<>(commandHistory);
    }

    public Directory getCurrentDirectory() {
        return currentDirectory;
    }

    public void setCurrentDirectory(Directory directory) {
        this.currentDirectory = directory;
    }

    public Directory getRoot() {
        return root;
    }
}