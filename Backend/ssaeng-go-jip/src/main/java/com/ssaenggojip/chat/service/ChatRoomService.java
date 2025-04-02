package com.ssaenggojip.chat.service;

import com.mongodb.client.result.UpdateResult;
import com.ssaenggojip.chat.converter.ChatConverter;
import com.ssaenggojip.chat.dto.ChatRoomResponseDto;
import com.ssaenggojip.chat.entity.ChatRoom;
import com.ssaenggojip.chat.entity.UserChatRoom;
import com.ssaenggojip.chat.repository.ChatRoomRepository;
import com.ssaenggojip.chat.repository.UserChatRoomRepository;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserChatRoomRepository userChatRoomRepository;

    private final MongoTemplate mongoTemplate;

    public List<ChatRoomResponseDto> getPopularChatRoom() {
        return chatRoomRepository.findTop10ByOrderByUserCountDesc()
                .stream().map(ChatConverter::toChatRoomResponseDto).toList();
    }

    public List<ChatRoomResponseDto> searchChatRoom(String keyword) {
        return chatRoomRepository.findByNameContaining(keyword)
                .stream().map(ChatConverter::toChatRoomResponseDto).toList();
    }

    public List<ChatRoomResponseDto> getMyChatRoom(User user) {
        List<String> chatRoomIdList = userChatRoomRepository.findByUser(user)
                .stream().map(UserChatRoom::getChatRoomId).toList();

        return chatRoomRepository.findByIdIn(chatRoomIdList)
                .stream().map(ChatConverter::toChatRoomResponseDto).toList();
    }

    @Transactional
    public void enterChatRoom(User user, String chatRoomId) {
        if (userChatRoomRepository.findByUserAndChatRoomId(user, chatRoomId).isPresent()) {
            return;
        }

        Query query = new Query(
                Criteria.where("_id").is(chatRoomId)
                        .and("userCount").lt(1000)
        );

        Update update = new Update().inc("userCount", 1);
        UpdateResult result = mongoTemplate.updateFirst(query, update, ChatRoom.class);

        if (result.getModifiedCount() == 0) {
            throw new IllegalStateException("채팅방 인원이 가득 찼습니다.");
        }

        userChatRoomRepository.save(UserChatRoom.builder()
                .chatRoomId(chatRoomId)
                .user(user)
                .build());
    }

    @Transactional
    public void leaveChatRoom(User user, String chatRoomId) {
        if (userChatRoomRepository.findByUserAndChatRoomId(user, chatRoomId).isEmpty()) {
            return;
        }

        userChatRoomRepository.deleteByUserAndChatRoomId(user, chatRoomId);

        Query query = new Query(Criteria.where("_id").is(chatRoomId));
        Update update = new Update().inc("userCount", -1);

        mongoTemplate.updateFirst(query, update, ChatRoom.class);
    }
}
