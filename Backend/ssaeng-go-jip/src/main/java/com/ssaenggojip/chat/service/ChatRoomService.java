package com.ssaenggojip.chat.service;

import com.ssaenggojip.chat.converter.ChatRoomConverter;
import com.ssaenggojip.chat.dto.ChatRoomResponseDto;
import com.ssaenggojip.chat.entity.UserChatRoom;
import com.ssaenggojip.chat.repository.ChatRoomRepository;
import com.ssaenggojip.chat.repository.UserChatRoomRepository;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserChatRoomRepository userChatRoomRepository;

    public List<ChatRoomResponseDto> getPopularChatRoom() {
        return chatRoomRepository.findTop10ByOrderByUserCountDesc()
                .stream().map(ChatRoomConverter::toChatRoomResponseDto).toList();
    }

    public List<ChatRoomResponseDto> searchChatRoom(String keyword) {
        return chatRoomRepository.findByNameContaining(keyword)
                .stream().map(ChatRoomConverter::toChatRoomResponseDto).toList();
    }

    public List<ChatRoomResponseDto> getMyChatRoom(User user) {
        List<String> chatRoomIdList = userChatRoomRepository.findByUser(user)
                .stream().map(UserChatRoom::getChatRoomId).toList();

        return chatRoomRepository.findByIdIn(chatRoomIdList)
                .stream().map(ChatRoomConverter::toChatRoomResponseDto).toList();
    }
}
