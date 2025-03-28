package com.ssaenggojip.targetAddress.repository;

import com.ssaenggojip.targetAddress.entity.TargetAddress;
import com.ssaenggojip.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TargetAddressRepository extends JpaRepository<TargetAddress, Long> {
    List<TargetAddress> findByUser(User user);
}
