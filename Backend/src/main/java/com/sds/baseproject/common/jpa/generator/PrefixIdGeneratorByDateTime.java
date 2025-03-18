package com.sds.baseproject.common.jpa.generator;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.generator.BeforeExecutionGenerator;
import org.hibernate.generator.EventType;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.EnumSet;

import static org.hibernate.generator.EventTypeSets.INSERT_ONLY;

/**
 * Prefix 와 DateTime을 조합하여 id를 생성하여 중복이 발생하지 않는 id를 생성한다.
 * 동시에 많은 entity생성이 요구될 때 별도의 중복체크 없이 id를 만들때 유용하다.
 * 동일한 ms에 요청이 들어오는 경우를 대비하여 9자리의 random 수를 붙여준다.
 * PREFIX + yyyyMMddHHmmssSSS + 000000000 형태로 만들어진다.
 * 예 : BD20250101123022444123456789.
 */
public class PrefixIdGeneratorByDateTime implements BeforeExecutionGenerator {

    private static DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS").withZone(ZoneId.systemDefault());
    private static SecureRandom random = new SecureRandom();

    private String prefix;
    private String randomNumberFormat = "%09d";

    public PrefixIdGeneratorByDateTime(com.sds.baseproject.common.jpa.generator.annotations.PrefixIdGeneratorByDateTime config) {
        this.prefix = config.prefix();
    }


    @Override
    public Object generate(SharedSessionContractImplementor session, Object owner, Object currentValue, EventType eventType) {
        StringBuilder sb = new StringBuilder();
        sb.append(prefix);
        sb.append(DATE_TIME_FORMATTER.format(Instant.now()));
        sb.append(String.format(randomNumberFormat, random.nextInt(999999999)));
        return sb.toString();
    }

    @Override
    public EnumSet<EventType> getEventTypes() {
        return INSERT_ONLY;
    }
}
