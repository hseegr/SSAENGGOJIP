package com.ssaenggojip.config;

import com.ssaenggojip.chat.config.RedisPublisher;
import com.ssaenggojip.chat.config.RedisSubscriber;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;

@TestConfiguration
public class TestRedisConfig {
    @Bean
    public RedisPublisher redisPublisher() {
        return Mockito.mock(RedisPublisher.class);
    }

    @Bean
    public RedisSubscriber redisSubscriber() {
        return Mockito.mock(RedisSubscriber.class);
    }

    @Bean
    public ChannelTopic chatTopic() {
        return new ChannelTopic("test-chat");
    }

    @Bean
    public StringRedisTemplate stringRedisTemplate() {
        return Mockito.mock(StringRedisTemplate.class);
    }
}
