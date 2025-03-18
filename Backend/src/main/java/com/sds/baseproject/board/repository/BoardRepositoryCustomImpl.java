package com.sds.baseproject.board.repository;

import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.sds.baseproject.board.entity.Board;
import com.sds.baseproject.board.payload.BoardSearchRequest;
import com.sds.baseproject.common.jpa.AbstractQueryDslRepository;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import static com.sds.baseproject.board.entity.QBoard.board;

public class BoardRepositoryCustomImpl extends AbstractQueryDslRepository implements BoardRepositoryCustom {
    public BoardRepositoryCustomImpl(JPAQueryFactory queryFactory, EntityManager entityManager) {
        super(queryFactory, entityManager);
    }

    @Override
    public Page<Board> getBoardPage(String bbsId, BoardSearchRequest searchRequest, Pageable pageable) {
        JPQLQuery<Board> query = from(board);

        query.where(board.bbsId.eq(bbsId.toUpperCase()), board.deleted.eq(false));

        if (StringUtils.hasText(searchRequest.getKeyword())) {
            query.where(board.title.containsIgnoreCase(searchRequest.getKeyword())
                    .or(board.content.containsIgnoreCase(searchRequest.getKeyword())));
        }

        query.orderBy(board.boardId.desc());
        return getPageImpl(query, pageable);
    }
}
