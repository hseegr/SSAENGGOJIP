package com.ssaenggojip.user.entity;

import com.ssaenggojip.common.enums.SocialLoginType;
import com.ssaenggojip.common.entity.BaseEntity;
import com.ssaenggojip.property.entity.PropertyLike;
import com.ssaenggojip.targetaddress.entity.TargetAddress;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String nickname;

    @Setter
    @Column(nullable = false, length = 100)
    private String email;

    @Setter
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean emailVerified;

    @Column(nullable = false, length = 1024)
    private String socialLoginId;

    @Column(nullable = false, length = 30)
    private SocialLoginType socialLoginType;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TargetAddress> targetAddressList;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PropertyLike> propertyLikeList;

    @Setter
    @Type(value = JsonType.class)
    @Column(name = "facility_preferences", columnDefinition = "vector(8)")
    private List<Double> facilityPreferences;
}
