package com.filesystem.controller;

import com.filesystem.service.FileSystemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fs")
public class FileSystemController {
    private final FileSystemService fileSystemService;

    public FileSystemController(FileSystemService fileSystemService) {
        this.fileSystemService = fileSystemService;
    }


    @GetMapping("/history")
    public ResponseEntity<List<String>> getCommandHistory() {
        return ResponseEntity.ok(fileSystemService.getCommandsHistory());
    }

    @PostMapping("/history")
    public ResponseEntity<Void> addCommandToHistory(@RequestBody String command) {
        fileSystemService.addToHistory(command);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/mkdir/{name}")
    public ResponseEntity<String> mkdir(@PathVariable String name) {
        fileSystemService.mkdir(name);
        return ResponseEntity.ok("Directory created: " + name);
    }

    @DeleteMapping("/rmdir/{name}")
    public ResponseEntity<String> rmdir(@PathVariable String name) {
        fileSystemService.rmdir(name);
        return ResponseEntity.ok("Directory removed: " + name);
    }

    @GetMapping("/tree")
    public ResponseEntity<String> tree() {
        return ResponseEntity.ok(fileSystemService.tree());
    }

    @PostMapping("/rename")
    public ResponseEntity<String> rename(@RequestBody Map<String, String> request) {
        String oldName = request.get("oldName");
        String newName = request.get("newName");
        fileSystemService.rename(oldName, newName);
        return ResponseEntity.ok("Renamed " + oldName + " to " + newName);
    }

    @GetMapping("/ls")
    public ResponseEntity<List<String>> ls() {
        return ResponseEntity.ok(fileSystemService.ls());
    }

    @GetMapping("/ls-l")
    public ResponseEntity<List<Map<String, Object>>> lsDetailed() {
        return ResponseEntity.ok(fileSystemService.lsDetailed());
    }

    @PostMapping("/touch")
    public ResponseEntity<String> touch(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String extension = request.get("extension");
        fileSystemService.touch(name, extension);
        return ResponseEntity.ok("File created: " + name + "." + extension);
    }

    @PostMapping("/echo")
    public ResponseEntity<String> echo(@RequestBody Map<String, String> request) {
        String fileName = request.get("fileName");
        String content = request.get("content");
        boolean append = Boolean.parseBoolean(request.get("append"));
        fileSystemService.echo(fileName, content, append);
        return ResponseEntity.ok("Content " + (append ? "appended to" : "written to") + " file: " + fileName);
    }

    @GetMapping("/cat/{fileName}")
    public ResponseEntity<String> cat(@PathVariable String fileName) {
        return ResponseEntity.ok(fileSystemService.cat(fileName));
    }

    @DeleteMapping("/rm/{name}")
    public ResponseEntity<String> rm(@PathVariable String name) {
        fileSystemService.rm(name);
        return ResponseEntity.ok("Removed: " + name);
    }

    @GetMapping("/head/{fileName}/{lines}")
    public ResponseEntity<List<String>> head(@PathVariable String fileName, @PathVariable int lines) {
        return ResponseEntity.ok(fileSystemService.head(fileName, lines));
    }

    @GetMapping("/tail/{fileName}/{lines}")
    public ResponseEntity<List<String>> tail(@PathVariable String fileName, @PathVariable int lines) {
        return ResponseEntity.ok(fileSystemService.tail(fileName, lines));
    }

    @GetMapping("/wc/{fileName}")
    public ResponseEntity<Map<String, Integer>> wc(@PathVariable String fileName) {
        return ResponseEntity.ok(fileSystemService.wc(fileName));
    }

    @PostMapping("/cd")
    public ResponseEntity<String> cd(@RequestBody Map<String, String> request) {
        String path = request.get("path");
        fileSystemService.cd(path);
        return ResponseEntity.ok("Changed directory to: " + path);
    }

    @GetMapping("/pwd")
    public ResponseEntity<String> pwd() {
        return ResponseEntity.ok(fileSystemService.pwd());
    }

    @GetMapping("/find")
    public ResponseEntity<List<String>> find(@RequestParam String name) {
        return ResponseEntity.ok(fileSystemService.find(name));
    }

    @GetMapping("/grep/{fileName}")
    public ResponseEntity<List<String>> grep(@PathVariable String fileName, @RequestParam String term) {
        return ResponseEntity.ok(fileSystemService.grep(fileName, term));
    }

    @PostMapping("/chmod")
    public ResponseEntity<String> chmod(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String permissions = request.get("permissions");
        fileSystemService.chmod(name, permissions);
        return ResponseEntity.ok("Changed permissions for " + name);
    }

    @PostMapping("/chown")
    public ResponseEntity<String> chown(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String owner = request.get("owner");
        fileSystemService.chown(name, owner);
        return ResponseEntity.ok("Changed owner of " + name + " to " + owner);
    }

    @GetMapping("/stat/{name}")
    public ResponseEntity<Map<String, Object>> stat(@PathVariable String name) {
        return ResponseEntity.ok(fileSystemService.stat(name));
    }

    @GetMapping("/du/{name}")
    public ResponseEntity<Long> du(@PathVariable String name) {
        return ResponseEntity.ok(fileSystemService.du(name));
    }

    @PostMapping("/cp")
    public ResponseEntity<String> cp(@RequestBody Map<String, String> request) {
        String source = request.get("source");
        String destination = request.get("destination");
        fileSystemService.cp(source, destination);
        return ResponseEntity.ok("Copied " + source + " to " + destination);
    }

    @PostMapping("/mv")
    public ResponseEntity<String> mv(@RequestBody Map<String, String> request) {
        String source = request.get("source");
        String destination = request.get("destination");
        fileSystemService.mv(source, destination);
        return ResponseEntity.ok("Moved " + source + " to " + destination);
    }

    @GetMapping("/diff")
    public ResponseEntity<List<String>> diff(@RequestParam String file1, @RequestParam String file2) {
        return ResponseEntity.ok(fileSystemService.diff(file1, file2));
    }

    @PostMapping("/zip")
    public ResponseEntity<String> zip(@RequestBody Map<String, Object> request) {
        String zipName = (String) request.get("zipName");
        @SuppressWarnings("unchecked")
        List<String> items = (List<String>) request.get("items");
        fileSystemService.zip(zipName, items);
        return ResponseEntity.ok("Created zip file: " + zipName);
    }

    @PostMapping("/unzip/{zipName}")
    public ResponseEntity<String> unzip(@PathVariable String zipName) {
        fileSystemService.unzip(zipName);
        return ResponseEntity.ok("Unzipped file: " + zipName);
    }

    @GetMapping("/history")
    public ResponseEntity<List<String>> history() {
        return ResponseEntity.ok(fileSystemService.getCommandHistory());
    }
}