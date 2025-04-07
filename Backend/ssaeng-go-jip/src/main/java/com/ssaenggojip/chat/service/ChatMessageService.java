package com.ssaenggojip.chat.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.chat.config.RedisPublisher;
import com.ssaenggojip.chat.converter.ChatConverter;
import com.ssaenggojip.chat.dto.ChatMessageResponseDto;
import com.ssaenggojip.chat.dto.ChatRequestDto;
import com.ssaenggojip.chat.entity.ChatMessage;
import com.ssaenggojip.chat.entity.ChatRoom;
import com.ssaenggojip.chat.entity.UserReport;
import com.ssaenggojip.chat.repository.ChatMessageRepository;
import com.ssaenggojip.chat.repository.UserReportRepository;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
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
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserReportRepository userReportRepository;

    private final MongoTemplate mongoTemplate;
    private final RedisPublisher redisPublisher;

    @Transactional
    public void sendMessage(User user, ChatRequestDto message) {
        switch (message.getMessageType()) {
            case TALK -> handleTalk(user, message);
            case DELETE -> handleDelete(user, message);
            case REPORT -> handleReport(user, message);
        }
    }

    @Transactional
    private void handleTalk(User user, ChatRequestDto message) {
        if (!mongoTemplate.exists(new Query(Criteria.where("_id").is(message.getChatRoomId())), ChatRoom.class)) {
            throw new GeneralException(ErrorStatus.NOT_FOUND_CHAT_ROOM_ID);
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .userId(user.getId())
                .chatRoomId(message.getChatRoomId())
                .nickname(message.getIsAnonymous() ? "익명" : user.getNickname())
                .content(message.getContent())
                .reportCount(0)
                .isActive(true)
                .build();

        chatMessageRepository.save(chatMessage);

        Query query = new Query(Criteria.where("_id").is(message.getChatRoomId()));
        Update update = new Update().set("lastMessage", message.getContent());

        mongoTemplate.updateFirst(query, update, ChatRoom.class);

        redisPublisher.publish(ChatConverter.toChatMessageResponseDto(chatMessage));
    }

    @Transactional
    private void handleDelete(User user, ChatRequestDto message) {
        ChatMessage chatMessage = chatMessageRepository.findById(message.getMessageId())
                .orElseThrow(() -> new GeneralException(ErrorStatus.NOT_FOUND_MESSAGE_ID));

        if (!chatMessage.getUserId().equals(user.getId())) {
            throw new GeneralException(ErrorStatus._UNAUTHORIZED); // 본인만 삭제 가능
        }

        chatMessage.setIsActive(false);
        chatMessage.setContent("삭제된 메시지입니다.");
        chatMessageRepository.save(chatMessage);

        redisPublisher.publish(ChatConverter.toChatMessageResponseDto(chatMessage));
    }

    @Transactional
    private void handleReport(User user, ChatRequestDto message) {
        if (userReportRepository.findByUserAndChatMessageId(user, message.getMessageId()).isPresent()) {
            throw new GeneralException(ErrorStatus.ALREADY_REPORTED);
        }

        userReportRepository.save(UserReport.builder()
                        .user(user)
                        .chatMessageId(message.getMessageId())
                        .build());

        Query query = new Query(Criteria.where("_id").is(message.getMessageId()));
        Update update = new Update().inc("reportCount", 1);

        ChatMessage chatMessage = mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(true),
                ChatMessage.class
        );

        if (chatMessage.getReportCount() >= 3 && chatMessage.getIsActive()) {
            chatMessage.setIsActive(false);
            chatMessage.setContent("신고된 메시지입니다.");
            chatMessageRepository.save(chatMessage);

            redisPublisher.publish(ChatConverter.toChatMessageResponseDto(chatMessage));
        }
    }

    public List<ChatMessageResponseDto> getMessages(String chatRoomId, String lastMessageId) {
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
