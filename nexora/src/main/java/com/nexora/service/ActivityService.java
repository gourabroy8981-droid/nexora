package com.nexora.service;

import lombok.RequiredArgsConstructor;
import com.nexora.entity.Activity;
import com.nexora.entity.User;
import com.nexora.enums.ActivityType;
import com.nexora.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    public void log(User actor,
                    ActivityType type,
                    Long referenceId,
                    String description) {

        Activity activity = Activity.builder()
                .actor(actor)
                .type(type)
                .referenceId(referenceId)
                .description(description)
                .createdAt(LocalDateTime.now())
                .build();

        activityRepository.save(activity);
    }
}
