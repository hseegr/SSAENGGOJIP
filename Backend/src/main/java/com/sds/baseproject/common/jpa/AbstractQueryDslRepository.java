package com.sds.baseproject.common.jpa;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.core.types.dsl.PathBuilderFactory;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.Querydsl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * QueryDsl 용 class를 만들고 주로 이용되는 기능들을 모아놓은 abstract class.
 */
@RequiredArgsConstructor
public abstract class AbstractQueryDslRepository {
    protected final JPAQueryFactory queryFactory;

    private final EntityManager entityManager;

    private Map<String, Querydsl> querydslMap = new HashMap<>();

    protected <T> Querydsl getQuerydsl(Class<T> clazz) {
        return querydslMap.computeIfAbsent(clazz.getName(), key -> {
            PathBuilder<T> builder = new PathBuilderFactory().create(clazz);
            return new Querydsl(entityManager, builder);
        });
    }

    protected <T> Page<T> getPageImpl(JPQLQuery<T> query, Pageable pageable) {
        long totalCount = query.fetchCount();
        List<T> results = getQuerydsl(query.getType()).applyPagination(pageable, query).fetch();
        return new PageImpl<>(results, pageable, totalCount);
    }

    protected <T> Map<T, Long> getCountMap(JPQLQuery<Tuple> query, Class<T> keyType) {
        Map<T, Long> map = new HashMap<>();
        List<Tuple> results = query.fetch();
        for (Tuple result : results) {
            map.put(result.get(0, keyType), result.get(1, Long.class));
        }
        return map;
    }

    protected <T> JPQLQuery<T> from(EntityPath<T> path) {
        return queryFactory.selectFrom(path);
    }
}
