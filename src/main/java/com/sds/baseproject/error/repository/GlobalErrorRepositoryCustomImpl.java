package com.sds.baseproject.error.repository;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sds.baseproject.common.jpa.AbstractQueryDslRepository;
import com.sds.baseproject.error.entity.Error;
import com.sds.baseproject.error.payload.ErrorSearchRequest;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import static com.sds.baseproject.error.entity.QError.error;

public class GlobalErrorRepositoryCustomImpl extends AbstractQueryDslRepository
        implements GlobalErrorRepositoryCustom {

    public GlobalErrorRepositoryCustomImpl(JPAQueryFactory queryFactory, EntityManager entityManager) {
        super(queryFactory, entityManager);
    }

    @Override
    public Page<Error> search(ErrorSearchRequest searchRequest, Pageable pageable) {
        JPQLQuery<Error> query = from(error);

        if (StringUtils.hasText(searchRequest.getKeyword())) {
            query.where(error.message.containsIgnoreCase(searchRequest.getKeyword())
                    .or(error.regUser.name.eq(searchRequest.getKeyword())));
        }

        if (searchRequest.getFromDate() != null) {
            query.where(
                    error.regDatetime.lt(searchRequest.getToDate()),
                    error.regDatetime.gt(searchRequest.getFromDate()));
        }
        
        query.orderBy(error.regDatetime.desc());
        return this.getPageImpl(query, pageable);
    }
}
