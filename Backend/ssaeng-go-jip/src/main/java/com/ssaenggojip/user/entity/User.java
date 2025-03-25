package com.ssaenggojip.user.entity;

import com.ssaenggojip.common.enums.SocialLoginType;
import com.ssaenggojip.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false, length = 30)
    private String nickname;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 1024)
    private String socialLoginId;

    @Column(nullable = false, length = 30)
    private SocialLoginType socialLoginType;
}
