package com.filesystem.model;

public abstract class Dados {
    protected String name;
    protected Directory parent;

    public Dados(String name, Directory parent) {
        this.name = name;
        this.parent = parent;
    }

    public Dados(){
        this.parent = null;
        this.name = null;
    }

    public abstract String getType();
    
    public String getName() {
        return name;
    }

    public Directory getParent() {
        return parent;
    }

    
}
