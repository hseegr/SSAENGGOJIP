package com.sds.baseproject.board.service;

import com.sds.baseproject.board.payload.BoardRequest;
import com.sds.baseproject.common.paylod.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

@Slf4j
@SpringBootTest
@AutoConfigureTestDatabase(replace = NONE)
class BoardServiceImplTest {
    @Autowired
    private BoardService boardService;


    @Test
    @Transactional
    @Rollback(value = false)
    void saveBoard() {
        BoardRequest boardRequest = new BoardRequest();
        boardRequest.setTitle("test");
        boardRequest.setContent("test");

        ApiResponse response = this.boardService.saveBoard("NOTICE", boardRequest);

        Assertions.assertNotNull(response);
    }
}
