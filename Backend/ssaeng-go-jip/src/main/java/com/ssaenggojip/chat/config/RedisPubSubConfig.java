package com.ssaenggojip.chat.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
@RequiredArgsConstructor
public class RedisPubSubConfig {

    private final RedisSubscriber redisSubscriber;

    // 채널 이름 정의 (채팅 용도)
    @Bean
    public ChannelTopic chatTopic() {
        return new ChannelTopic("chat");
    }

    // Redis 메시지 리스너 설정 (구독자 등록)
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory factory,
            ChannelTopic chatTopic
    ) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);
        container.addMessageListener(redisSubscriber, chatTopic);
        return container;
    }

    // Redis publish 용 템플릿 (문자열 기반)
    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }
}
