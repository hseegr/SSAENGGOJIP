package com.sds.baseproject.role.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sds.baseproject.common.jpa.AbstractQueryDslRepository;
import com.sds.baseproject.role.entity.Role;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.util.Collection;
import java.util.Map;

import static com.sds.baseproject.role.entity.QRole.role;
import static com.sds.baseproject.role.entity.QUserRole.userRole;

public class RoleRepositoryCustomImpl extends AbstractQueryDslRepository
        implements RoleRepositoryCustom {


    public RoleRepositoryCustomImpl(JPAQueryFactory queryFactory, EntityManager entityManager) {
        super(queryFactory, entityManager);
    }

    @Override
    public Page<Role> search(String keyword, Pageable pageable) {
        JPQLQuery<Role> query = from(role);

        if (StringUtils.hasText(keyword)) {
            query.where(role.roleId.containsIgnoreCase(keyword)
                    .or(role.description.containsIgnoreCase(keyword)));
        }

        return this.getPageImpl(query, pageable);
    }

    @Override
    public Map<String, Long> getUserCountMap(Collection<String> roleIds) {
        JPQLQuery<Tuple> query = from(userRole)
                .where(userRole.roleId.in(roleIds))
                .groupBy(userRole.roleId)
                .select(userRole.roleId, userRole.count());
        return this.getCountMap(query, String.class);
    }
}
