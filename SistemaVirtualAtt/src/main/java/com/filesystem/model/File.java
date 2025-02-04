package com.filesystem.model;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

public class File extends Dados {
    private String content;
    private String extension;
    private long size;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private String owner;
    private String permissions;

    public File(String name, String content, String extension, Directory parent) {
        this.name = name;
        this.content = content;
        this.extension = extension;
        this.parent = parent;
        this.size = calculateSize();
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = LocalDateTime.now();
        this.owner = "root";
        this.permissions = "rw-r--r--";
    }

    public long calculateSize() {
        return content != null ? content.length() : 0;
    }

    public List<String> getLines() {
        return Arrays.asList(content.split("\n"));
    }

    public int getLineCount() {
        return content.isEmpty() ? 0 : content.split("\n").length;
    }

    public int getWordCount() {
        return content.isEmpty() ? 0 : content.split("\\s+").length;
    }

    public int getCharCount() {
        return content.length();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.modifiedAt = LocalDateTime.now();
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        this.size = calculateSize();
        this.modifiedAt = LocalDateTime.now();
    }

    public String getExtension() {
        return extension;
    }

    public Directory getParent() {
        return parent;
    }

    public void setParent(Directory parent) {
        this.parent = parent;
    }

    public long getSize() {
        return size;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getModifiedAt() {
        return modifiedAt;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
        this.modifiedAt = LocalDateTime.now();
    }

    public String getPermissions() {
        return permissions;
    }

    public void setPermissions(String permissions) {
        this.permissions = permissions;
        this.modifiedAt = LocalDateTime.now();
    }

    @Override
    public String getType() {
        return "File";
    }
}