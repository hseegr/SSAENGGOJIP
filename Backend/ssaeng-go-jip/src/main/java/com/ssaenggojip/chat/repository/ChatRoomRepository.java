package com.ssaenggojip.chat.repository;

import com.ssaenggojip.chat.entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    List<ChatRoom> findTop10ByOrderByUserCountDesc();
    List<ChatRoom> findByNameContaining(String keyword);
    List<ChatRoom> findByIdIn(List<String> idList);
}
