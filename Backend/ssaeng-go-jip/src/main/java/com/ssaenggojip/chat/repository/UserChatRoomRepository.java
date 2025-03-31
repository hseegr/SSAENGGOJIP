package com.ssaenggojip.chat.repository;

import com.ssaenggojip.chat.entity.UserChatRoom;
import com.ssaenggojip.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserChatRoomRepository extends JpaRepository<UserChatRoom, Long> {
    List<UserChatRoom> findByUser(User user);
}
