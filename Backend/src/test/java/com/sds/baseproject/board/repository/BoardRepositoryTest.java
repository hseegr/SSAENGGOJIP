package com.sds.baseproject.board.repository;

import com.sds.baseproject.board.entity.Board;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BoardRepositoryTest {

    @Autowired
    BoardRepository boardRepository;

    @Test
    @Rollback(value = false)
    public void saveBoard() {
        Board board = new Board();
        board.setBbsId("NOTICE");
        board.setTitle("test");
        board.setContent("test");

        board = this.boardRepository.save(board);

    }
}
