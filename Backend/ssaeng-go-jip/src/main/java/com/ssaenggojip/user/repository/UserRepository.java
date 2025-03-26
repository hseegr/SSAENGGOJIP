package com.ssaenggojip.user.repository;

import com.ssaenggojip.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findBySocialLoginId(String socialLoginId);
    Optional<User> findByNickname(String nickname);
}
