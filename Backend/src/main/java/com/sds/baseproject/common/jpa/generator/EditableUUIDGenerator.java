package com.sds.baseproject.common.jpa.generator;

import jakarta.persistence.Id;
import org.hibernate.boot.model.naming.IllegalIdentifierException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.generator.BeforeExecutionGenerator;
import org.hibernate.generator.EventType;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.Optional;
import java.util.UUID;

import static org.hibernate.generator.EventTypeSets.INSERT_ONLY;

/**
 * entity저장 시점에 id가 설정되어있다면 입력되어있는 id를 사용, null인 경우 새로운 uuid를 할당한다.
 * Spring의 기본 UUIDGenerator 는  Service 로직에서 id를 입력할 수 없어 강제 지정이 필요할 시 이용된다.
 */
public class EditableUUIDGenerator implements BeforeExecutionGenerator {
    @Override
    public Object generate(SharedSessionContractImplementor session, Object owner, Object currentValue, EventType eventType) {
        Optional<Field> idField = Arrays.stream(owner.getClass().getDeclaredFields())
                .filter(field -> field.isAnnotationPresent(Id.class))
                .findFirst();

        if (!idField.isPresent()) {
            throw new IllegalIdentifierException("Unable to find id field");
        }

        try {
            idField.get().setAccessible(true);
            Object idValue = idField.get().get(owner);
            if (idValue == null) {
                return UUID.randomUUID().toString();
            } else {
                return idValue;
            }
        } catch (IllegalAccessException e) {
            throw new IllegalIdentifierException("Unable get find id field");
        }
    }

    @Override
    public EnumSet<EventType> getEventTypes() {
        return INSERT_ONLY;
    }
}
