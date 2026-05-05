package com.nexora.service;

import com.nexora.dto.CommentResponse;
import com.nexora.entity.Comment;
import com.nexora.entity.Project;
import com.nexora.entity.User;
import com.nexora.repository.CommentRepository;
import com.nexora.repository.ProjectRepository;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public void addComment(Long projectId, String content, Long parentId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElseThrow();
        Project project = projectRepository.findById(projectId).orElseThrow();

        Comment parent = null;
        if (parentId != null) {
            parent = commentRepository.findById(parentId).orElse(null);
        }

        Comment comment = Comment.builder()
                .content(content)
                .createdAt(LocalDateTime.now())
                .user(user)
                .project(project)
                .parent(parent)
                .build();

        commentRepository.save(comment);
    }

    public List<CommentResponse> getComments(Long projectId) {

        return commentRepository.findByProject_IdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(c -> new CommentResponse(
                        c.getId(),
                        c.getContent(),
                        c.getUser().getName(),
                        c.getUser().getProfileImage(),
                        c.getCreatedAt()
                ))
                .toList();
    }

    public void deleteComment(Long commentId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow();

        // 🔒 only owner can delete
        if (!comment.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Not allowed");
        }

        commentRepository.deleteById(commentId);
    }
}
