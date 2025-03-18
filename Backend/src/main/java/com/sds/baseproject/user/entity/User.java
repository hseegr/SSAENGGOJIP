package com.sds.baseproject.user.entity;

import com.sds.baseproject.common.jpa.converter.BooleanToYNConverter;
import com.sds.baseproject.common.jpa.generator.annotations.EditableUUIDGenerator;
import com.sds.baseproject.role.entity.UserRole;
import com.sds.baseproject.user.code.Region;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cm_user")
@Getter
@Setter
public class User extends BaseEntity {
    @Id
    @EditableUUIDGenerator
    private String userId;

    private String loginId;

    private String password;

    private String name;

    private String regionCd;

    @Column(name = "regionCd", updatable = false, insertable = false)
    @Enumerated(EnumType.STRING)
    private Region region;

    private String disabledYn = "N";

    @Convert(converter = BooleanToYNConverter.class)
    @Column(name = "disabledYn", updatable = false, insertable = false)
    private boolean disabled;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRole> userRoles = new ArrayList<>();
}
