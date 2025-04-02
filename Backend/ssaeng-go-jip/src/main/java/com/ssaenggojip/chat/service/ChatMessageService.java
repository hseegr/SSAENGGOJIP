package com.ssaenggojip.chat.service;

import com.ssaenggojip.chat.converter.ChatConverter;
import com.ssaenggojip.chat.dto.ChatMessageResponseDto;
import com.ssaenggojip.chat.dto.ChatRequestDto;
import com.ssaenggojip.chat.entity.ChatMessage;
import com.ssaenggojip.chat.entity.ChatRoom;
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
            case TALK -> handleTalk(user, message);
        }
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

        Query query = new Query(Criteria.where("chatRoomId").is(chatRoomId));

        if (lastMessageId != null && !lastMessageId.isBlank()) {
            query.addCriteria(Criteria.where("_id").lt(new ObjectId(lastMessageId)));
        }

        query.with(Sort.by(Sort.Direction.DESC, "_id"));
        query.limit(20);

        return mongoTemplate.find(query, ChatMessage.class)
                .stream().map(ChatConverter::toChatMessageResponseDto).toList();
    }
}
