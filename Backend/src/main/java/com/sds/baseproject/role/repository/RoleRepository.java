package com.sds.baseproject.role.repository;

import com.sds.baseproject.role.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String>, RoleRepositoryCustom {
    boolean existsByRoleId(String roleId);
}
