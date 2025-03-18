package com.sds.baseproject.board.repository;

import com.sds.baseproject.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, String>, BoardRepositoryCustom {
    List<Board> findAllByBbsId(String bbsId);
}
