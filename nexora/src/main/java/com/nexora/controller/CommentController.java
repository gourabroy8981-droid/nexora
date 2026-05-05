package com.nexora.controller;

import com.nexora.dto.CommentResponse;
import com.nexora.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{projectId}")
    public ResponseEntity<?> addComment(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> body
    ) {
        Long parentId = body.get("parentId") != null
                ? Long.parseLong(body.get("parentId"))
                : null;

        commentService.addComment(projectId, body.get("content"), parentId);

        return ResponseEntity.ok("Added");
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(commentService.getComments(projectId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok("Deleted");
    }
}