package com.sds.baseproject.user.repository;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sds.baseproject.common.jpa.AbstractQueryDslRepository;
import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.payload.UserSearchRequest;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import static com.sds.baseproject.user.entity.QUser.user;

public class UserRepositoryCustomImpl extends AbstractQueryDslRepository implements UserRepositoryCustom {
    public UserRepositoryCustomImpl(JPAQueryFactory queryFactory, EntityManager entityManager) {
        super(queryFactory, entityManager);
    }

    @Override
    public Page<User> getUserPage(UserSearchRequest searchRequest, Pageable pageable) {
        JPQLQuery<User> query = from(user);

        if (StringUtils.hasText(searchRequest.getKeyword())) {
            query.where(
                    user.loginId.containsIgnoreCase(searchRequest.getKeyword())
                            .or(user.name.containsIgnoreCase(searchRequest.getKeyword())));
        }

        if (StringUtils.hasText(searchRequest.getRegionCd())) {
            query.where(user.regionCd.eq(searchRequest.getRegionCd()));
        }

        query.orderBy(user.modDatetime.desc());

        return this.getPageImpl(query, pageable);
    }
}
