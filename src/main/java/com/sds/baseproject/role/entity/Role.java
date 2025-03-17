package com.sds.baseproject.role.entity;

import com.sds.baseproject.user.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cm_role")
@Getter
@Setter
public class Role extends BaseEntity {
    @Id
    String roleId;

    String description;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<UserRole> userRoles = new HashSet<>();
}
