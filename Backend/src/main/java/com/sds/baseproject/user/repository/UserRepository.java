package com.sds.baseproject.user.repository;

import com.sds.baseproject.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String>, UserRepositoryCustom {
    Optional<User> findByLoginId(String loginId);

    boolean existsByLoginId(String loginId);
}
