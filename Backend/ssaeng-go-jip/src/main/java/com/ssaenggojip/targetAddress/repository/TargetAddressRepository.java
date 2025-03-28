package com.ssaenggojip.targetAddress.repository;

import com.ssaenggojip.targetAddress.entity.TargetAddress;
import com.ssaenggojip.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TargetAddressRepository extends JpaRepository<TargetAddress, Long> {
    List<TargetAddress> findByUserOrderByIsDefaultDesc(User user);
    Optional<TargetAddress> findByUserAndIsDefault(User user, Boolean isDefault);
}
