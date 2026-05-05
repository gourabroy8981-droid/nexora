package com.nexora.controller;

import com.nexora.dto.ProjectRequest;
import com.nexora.dto.ProjectResponse;
import com.nexora.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // ✅ NEW IMPORT

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // 🔥 Add project (UPDATED FOR IMAGE UPLOAD)
    @PostMapping(consumes = "multipart/form-data")
    public String addProject(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String techStack,
            @RequestParam(required = false) String githubLink,
            @RequestParam(required = false) String liveDemoLink,
            @RequestParam(required = false) MultipartFile file
    ) {
        ProjectRequest request = new ProjectRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setTechStack(techStack);
        request.setGithubLink(githubLink);
        request.setLiveDemoLink(liveDemoLink);

        return projectService.addProject(request, file);
    }

    // 🔥 Like project (JWT-based user)
    @PostMapping("/{projectId}/like")
    public String likeProject(@PathVariable Long projectId) {
        return projectService.likeProject(projectId);
    }

    // 🔥 Get all projects (feed)
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // 🔥 Get projects by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectResponse>> getUserProjects(@PathVariable Long userId) {
        return ResponseEntity.ok(projectService.getProjectsByUser(userId));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectById(projectId));
    }

    @PutMapping(value = "/{projectId}", consumes = "multipart/form-data")
    public ResponseEntity<String> updateProject(
            @PathVariable Long projectId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String techStack,
            @RequestParam(required = false) String githubLink,
            @RequestParam(required = false) String liveDemoLink,
            @RequestParam(required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(
                projectService.updateProject(projectId, title, description, techStack, githubLink, liveDemoLink, file)
        );
    }
    @DeleteMapping("/{projectId}")
    public ResponseEntity<String> deleteProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.deleteProject(projectId));
    }
}