package com.ssaenggojip.chat.repository;

import com.ssaenggojip.chat.entity.UserChatRoom;
import com.ssaenggojip.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserChatRoomRepository extends JpaRepository<UserChatRoom, Long> {
    List<UserChatRoom> findByUser(User user);
    Optional<UserChatRoom> findByUserAndChatRoomId(User user, String chatRoomId);
    void deleteByUserAndChatRoomId(User user, String chatRoomId);
}
