package com.nexora.service;

import com.nexora.dto.ProjectRequest;
import com.nexora.dto.ProjectResponse;
import com.nexora.entity.Project;
import com.nexora.entity.ProjectLike;
import com.nexora.entity.User;
import com.nexora.enums.ActivityType;
import com.nexora.repository.ProjectLikeRepository;
import com.nexora.repository.ProjectRepository;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectLikeRepository projectLikeRepository;
    private final DevScoreService devScoreService;
    private final NotificationService notificationService;

    // 🔥 ✅ ADD THIS DEPENDENCY
    private final ActivityService activityService;

    // ✅ Add Project (JWT-based user)
    public String addProject(ProjectRequest request, MultipartFile file) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .techStack(request.getTechStack())
                .githubLink(request.getGithubLink())
                .liveDemoLink(request.getLiveDemoLink())
                .likeCount(0)
                .user(user)
                .build();
        // 🔥 IMAGE UPLOAD (ADD THIS BLOCK)
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + ".jpg";

                String uploadDir = "D:/nexora/nexora/uploads/";

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                File destination = new File(uploadDir + fileName);
                file.transferTo(destination);

                project.setImage(fileName); // ✅ save image

            } catch (Exception e) {
                throw new RuntimeException("Image upload failed: " + e.getMessage());
            }
        }

        projectRepository.save(project);

        // 🔥 ✅ PROJECT CREATION ACTIVITY
        activityService.log(
                user,
                ActivityType.PROJECT_CREATED,
                project.getId(),
                user.getName() + " created a new project"
        );

        return "Project added successfully!";
    }

    // ✅ Get All Projects
    public List<ProjectResponse> getAllProjects() {

        return projectRepository.findAll()
                .stream()
                .map(project -> new ProjectResponse(
                        project.getId(),
                        project.getTitle(),
                        project.getDescription(),
                        project.getTechStack(),
                        project.getGithubLink(),
                        project.getLiveDemoLink(),
                        project.getLikeCount(),
                        project.getUser().getId(),
                        project.getUser().getName(),
                        project.getUser().getEmail(),
                        project.getImage()
                ))
                .toList();
    }

    // ✅ Get Projects By User
    public List<ProjectResponse> getProjectsByUser(Long userId) {

        return projectRepository.findByUserId(userId)
                .stream()
                .map(project -> new ProjectResponse(
                        project.getId(),
                        project.getTitle(),
                        project.getDescription(),
                        project.getTechStack(),
                        project.getGithubLink(),
                        project.getLiveDemoLink(),
                        project.getLikeCount(),
                        project.getUser().getId(),
                        project.getUser().getName(),
                        project.getUser().getEmail(),
                        project.getImage()
                ))
                .toList();
    }

    // ✅ Like Project (JWT-based user + Notification + Activity)
    public String likeProject(Long projectId) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // 🚫 Prevent self-like
        if (project.getUser().getId().equals(user.getId())) {
            return "You cannot like your own project!";
        }

        // 🚫 Prevent duplicate likes
        if (projectLikeRepository
                .findByUser_IdAndProject_Id(user.getId(), projectId)
                .isPresent()) {
            return "You already liked this project!";
        }

        // Save like
        ProjectLike like = ProjectLike.builder()
                .user(user)
                .project(project)
                .build();

        projectLikeRepository.save(like);

        // Update like count
        Long totalLikes = projectLikeRepository.countByProject_Id(projectId);
        project.setLikeCount(totalLikes.intValue());
        projectRepository.save(project);

        // 🔥 Add DevScore
        devScoreService.addPoints(project.getUser(), 5);

        // 🔔 Create Notification
        notificationService.createNotification(
                project.getUser(),
                user.getName() + " liked your project: " + project.getTitle()
        );

        // 🔥 ✅ LIKE ACTIVITY
        activityService.log(
                user,
                ActivityType.PROJECT_LIKED,
                project.getId(),
                user.getName() + " liked a project"
        );

        return "Project liked successfully!";
    }

    public ProjectResponse getProjectById(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getTechStack(),
                project.getGithubLink(),
                project.getLiveDemoLink(),
                project.getLikeCount(),
                project.getUser().getId(),
                project.getUser().getName(),
                project.getUser().getEmail(), // ✅ IMPORTANT
                project.getImage()
        );
    }

    public String updateProject(Long projectId,
                                String title,
                                String description,
                                String techStack,
                                String githubLink,
                                String liveDemoLink,
                                MultipartFile file) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // 🔒 SECURITY CHECK
        if (!project.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You are not allowed to edit this project");
        }

        // ✅ UPDATE TEXT
        project.setTitle(title);
        project.setDescription(description);
        project.setTechStack(techStack);
        project.setGithubLink(githubLink);
        project.setLiveDemoLink(liveDemoLink);

        // 🔥 IMAGE UPDATE
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + ".jpg";

                String uploadDir = "D:/nexora/nexora/uploads/";

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                File destination = new File(uploadDir + fileName);
                file.transferTo(destination);

                project.setImage(fileName);
            } catch (Exception e) {
                throw new RuntimeException("Image update failed");
            }
        }

        projectRepository.save(project);

        return "Project updated successfully!";
    }

    public String deleteProject(Long projectId) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // 🔒 SECURITY CHECK
        if (!project.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You are not allowed to delete this project");
        }

        projectRepository.delete(project);

        return "Project deleted successfully!";
    }
}