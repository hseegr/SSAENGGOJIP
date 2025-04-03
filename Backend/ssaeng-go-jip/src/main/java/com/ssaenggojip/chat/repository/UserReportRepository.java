package com.ssaenggojip.chat.repository;

import com.ssaenggojip.chat.entity.UserReport;
import com.ssaenggojip.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserReportRepository extends JpaRepository<UserReport, Long> {
    Optional<UserReport> findByUserAndChatMessageId(User user, String chatMessageId);
}
