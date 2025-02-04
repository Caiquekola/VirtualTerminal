package com.filesystem.model;

import java.time.LocalDateTime;
import java.util.*;
import java.util.Map.Entry;

public class Directory extends Dados {
    private Directory parent;
    private Map<String, Dados> content;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private String owner;
    private String permissions;

    public Directory(String name, Directory parent) {
        this.name = name;
        this.parent = parent;
        this.content = new HashMap<>();
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = LocalDateTime.now();
        this.owner = "root";
        this.permissions = "rwxr-xr-x";
    }

    // Adiciona um novo diretório
    public void addDirectory(String name) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Directory name cannot be null or empty");
        }

        if (content.containsKey(name)) {
            throw new IllegalArgumentException("A directory with name '" + name + "' already exists");
        }

        content.put(name, new Directory(name, this));
        this.modifiedAt = LocalDateTime.now();
    }

    // Adiciona um novo arquivo
    public void addFile(File file) {
        if (file == null || file.getName() == null || file.getExtension() == null) {
            throw new IllegalArgumentException("Invalid file: must have name and extension");
        }

        String fileName = file.getName() + "." + file.getExtension();
        if (content.containsKey(fileName)) {
            throw new IllegalArgumentException("A file with name '" + fileName + "' already exists");
        }

        content.put(fileName, file);
        this.modifiedAt = LocalDateTime.now();
    }

    // Remove um item pelo nome
    public void remove(String name) {
        content.remove(name);
        this.modifiedAt = LocalDateTime.now();
    }

    // Retorna o conjunto de nomes dos itens no diretório
    public Set<String> getContents() {
        return content.keySet();
    }

    // Retorna uma lista detalhada dos itens no diretório
    public List<Map<String, Object>> getDetailedContents() {
        List<Map<String, Object>> details = new ArrayList<>();
        for (Map.Entry<String, Dados> entry : content.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", entry.getKey());
            if (entry.getValue() instanceof File) {
                File file = (File) entry.getValue();
                item.put("type", "file");
                item.put("size", file.getSize());
                item.put("permissions", file.getPermissions());
                item.put("owner", file.getOwner());
                item.put("modified", file.getModifiedAt());
            } else if (entry.getValue() instanceof Directory) {
                Directory dir = (Directory) entry.getValue();
                item.put("type", "directory");
                item.put("modified", dir.getModifiedAt());
            }
            details.add(item);
        }
        return details;
    }

    // Calcula o tamanho total do diretório
    public long calculateSize() {
        long total = 0;
        for (Object item : content.values()) {
            if (item instanceof File) {
                total += ((File) item).getSize();
            } else if (item instanceof Directory) {
                total += ((Directory) item).calculateSize();
            }
        }
        return total;
    }

    // Renomeia um item no diretório
    public void rename(String oldName, String newName) {
        if (!content.containsKey(oldName)) {
            throw new IllegalArgumentException("Item not found: " + oldName);
        }
        if (content.containsKey(newName)) {
            throw new IllegalArgumentException("Item already exists: " + newName);
        }
        Dados item = content.remove(oldName);
        if (item instanceof File) {
            ((File) item).setName(newName.substring(0, newName.lastIndexOf('.')));
        } else if (item instanceof Directory) {
            ((Directory) item).setName(newName);
        }
        content.put(newName, item);
        this.modifiedAt = LocalDateTime.now();
    }

    // Encontra itens no diretório pelo nome
    public List<String> find(String searchName) {
        List<String> results = new ArrayList<>();
        for (Entry<String, Dados> entry : content.entrySet()) {
            if (entry.getKey().contains(searchName)) {
                results.add(getFullPath() + "/" + entry.getKey());
            }
            if (entry.getValue() instanceof Directory) {
                results.addAll(((Directory) entry.getValue()).find(searchName));
            }
        }
        return results;
    }

    // Retorna o caminho completo do diretório
    public String getFullPath() {
        if (parent == null) {
            return "";
        }
        String parentPath = parent.getFullPath();
        return parentPath.isEmpty() ? "/" + name : parentPath + "/" + name;
    }

    // Retorna o nome do diretório
    public String getName() {
        return name;
    }

    // Define o nome do diretório
    public void setName(String name) {
        this.name = name;
        this.modifiedAt = LocalDateTime.now();
    }

    // Retorna o diretório pai
    public Directory getParent() {
        return parent;
    }

    // Retorna o conteúdo do diretório pelo nome
    public Object getContent(String name) {
        return content.get(name);
    }

    // Retorna a data de criação do diretório
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Retorna a data de modificação do diretório
    public LocalDateTime getModifiedAt() {
        return modifiedAt;
    }

    // Retorna o proprietário do diretório
    public String getOwner() {
        return owner;
    }

    // Define o proprietário do diretório
    public void setOwner(String owner) {
        this.owner = owner;
        this.modifiedAt = LocalDateTime.now();
    }

    // Retorna as permissões do diretório
    public String getPermissions() {
        return permissions;
    }

    // Define as permissões do diretório
    public void setPermissions(String permissions) {
        this.permissions = permissions;
        this.modifiedAt = LocalDateTime.now();
    }

    // Retorna a árvore de diretórios em formato de string
    public String getTree(String prefix) {
        StringBuilder result = new StringBuilder(prefix + name + "\n");
        List<String> sortedNames = new ArrayList<>(content.keySet());
        Collections.sort(sortedNames);
        for (int i = 0; i < sortedNames.size(); i++) {
            String itemName = sortedNames.get(i);
            Object item = content.get(itemName);
            boolean isLast = i == sortedNames.size() - 1;
            String newPrefix = prefix + (isLast ? "└── " : "├── ");
            String childPrefix = prefix + (isLast ? "    " : "│   ");
            if (item instanceof Directory) {
                result.append(((Directory) item).getTree(childPrefix));
            } else {
                result.append(newPrefix).append(itemName).append("\n");
            }
        }
        return result.toString();
    }

    @Override
    public String getType() {
        return "Directory";
    }
}