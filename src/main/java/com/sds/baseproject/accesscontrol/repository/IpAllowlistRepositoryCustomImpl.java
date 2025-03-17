package com.sds.baseproject.accesscontrol.repository;

import static com.sds.baseproject.accesscontrol.entity.QIpAllowlist.ipAllowlist;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sds.baseproject.accesscontrol.entity.IpAllowlist;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSearchRequest;
import com.sds.baseproject.common.jpa.AbstractQueryDslRepository;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

public class IpAllowlistRepositoryCustomImpl extends AbstractQueryDslRepository
    implements IpAllowlistRepositoryCustom {
  public IpAllowlistRepositoryCustomImpl(
      JPAQueryFactory queryFactory, EntityManager entityManager) {
    super(queryFactory, entityManager);
  }

  @Override
  public Page<IpAllowlist> search(IpAllowlistSearchRequest searchRequest, Pageable pageable) {
    JPQLQuery<IpAllowlist> query = from(ipAllowlist);
    if (StringUtils.hasText(searchRequest.getKeyword())) {
      query.where(
              ipAllowlist
              .ipAddr
              .eq(searchRequest.getKeyword())
              .or(ipAllowlist.description.containsIgnoreCase(searchRequest.getKeyword())));
    }
    return this.getPageImpl(query, pageable);
  }
}
