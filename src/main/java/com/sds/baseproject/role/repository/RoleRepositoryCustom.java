package com.sds.baseproject.role.repository;

import com.sds.baseproject.role.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.Map;

public interface RoleRepositoryCustom {
    Page<Role> search(String roleIdOrDesc, Pageable pageable);

    Map<String, Long> getUserCountMap(Collection<String> roleIds);
}
