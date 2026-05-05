package com.nexora.repository;

import com.nexora.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByProject_IdOrderByCreatedAtDesc(Long projectId);
    List<Comment> findByProject_IdAndParentIsNullOrderByCreatedAtDesc(Long projectId);
    List<Comment> findByParent_Id(Long parentId);
}