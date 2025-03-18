package com.sds.baseproject.common.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sds.baseproject.common.security.auditor.UserAuditorAware;
import jakarta.persistence.EntityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

@Configuration
public class JpaConfig {

    /**
     * Entity 저장 시 자동으로 작성자, 수정자를 기록하기 위한 설정
     *
     * @return AuditorAware 을 상속하여 userId 반환하는 Component.
     */
    @Bean
    public AuditorAware<String> userAuditorAware() {
        return new UserAuditorAware();
    }

    /**
     * AbstractQueryDslRepository를 상속하는 ***RepositoryCustomImpl 클래스들의 생성자에서 JPAQueryFactory를 받을 수 있도록 미리 bean에 등록해줌.
     *
     * @param entityManager jpa에서 사용하는 entityManager
     * @return JPAQueryFactory
     */
    @Bean
    public JPAQueryFactory jpaQueryFactory(EntityManager entityManager) {
        return new JPAQueryFactory(entityManager);
    }
}
