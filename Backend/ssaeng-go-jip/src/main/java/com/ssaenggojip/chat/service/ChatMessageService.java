package com.ssaenggojip.chat.service;

import com.mongodb.client.result.UpdateResult;
import com.ssaenggojip.chat.converter.ChatConverter;
import com.ssaenggojip.chat.dto.ChatMessageResponseDto;
import com.ssaenggojip.chat.dto.ChatRequestDto;
import com.ssaenggojip.chat.entity.ChatMessage;
import com.ssaenggojip.chat.entity.ChatRoom;
import com.ssaenggojip.chat.entity.UserChatRoom;
import com.ssaenggojip.chat.repository.ChatMessageRepository;
import com.ssaenggojip.chat.repository.UserChatRoomRepository;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserChatRoomRepository userChatRoomRepository;

    private final MongoTemplate mongoTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void sendMessage(User user, ChatRequestDto message) {
        switch (message.getMessageType()) {
            case ENTER -> handleEnter(user, message);
            case LEAVE -> handleLeave(user, message);
            case TALK -> handleTalk(user, message);
        }
    }

    @Transactional
    private void handleEnter(User user, ChatRequestDto message) {
        if (userChatRoomRepository.findByUserAndChatRoomId(user, message.getChatRoomId()).isPresent()) {
            return;
        }

        Query query = new Query(
                Criteria.where("_id").is(message.getChatRoomId())
                        .and("userCount").lt(1000)
        );

        Update update = new Update().inc("userCount", 1);
        UpdateResult result = mongoTemplate.updateFirst(query, update, ChatRoom.class);

        if (result.getModifiedCount() == 0) {
            throw new IllegalStateException("채팅방 인원이 가득 찼습니다.");
        }

        userChatRoomRepository.save(UserChatRoom.builder()
                .chatRoomId(message.getChatRoomId())
                .user(user)
                .build());
    }

    @Transactional
    private void handleLeave(User user, ChatRequestDto message) {
        if (userChatRoomRepository.findByUserAndChatRoomId(user, message.getChatRoomId()).isEmpty()) {
            return;
        }

        userChatRoomRepository.deleteByUserAndChatRoomId(user, message.getChatRoomId());

        Query query = new Query(Criteria.where("_id").is(message.getChatRoomId()));
        Update update = new Update().inc("userCount", -1);

        mongoTemplate.updateFirst(query, update, ChatRoom.class);
    }

    @Transactional
    private void handleTalk(User user, ChatRequestDto message) {
        ChatMessage chatMessage = ChatMessage.builder()
                .userId(user.getId())
                .chatRoomId(message.getChatRoomId())
                .nickname(user.getNickname())
                .content(message.getContent())
                .reportCount(0)
                .isDeleted(false)
                .build();

        chatMessageRepository.save(chatMessage);

        Query query = new Query(Criteria.where("_id").is(message.getChatRoomId()));
        Update update = new Update().set("lastMessage", message.getContent());

        mongoTemplate.updateFirst(query, update, ChatRoom.class);
        messagingTemplate.convertAndSend("/sub/chatroom." + message.getChatRoomId(), message);
    }

    public List<ChatMessageResponseDto> getMessages(String chatRoomId, String lastMessageId) {
        log.info("chatRoomId: {}, lastMessageId: {}", chatRoomId, lastMessageId);

        Query query = new Query(Criteria.where("chatRoomId").is(chatRoomId)
                .and("_id").lt(new ObjectId(lastMessageId)));
        query.with(Sort.by(Sort.Direction.DESC, "_id"));
        query.limit(20);

        return mongoTemplate.find(query, ChatMessage.class)
                .stream().map(ChatConverter::toChatMessageResponseDto).toList();
    }
}
