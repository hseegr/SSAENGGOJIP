package com.sds.baseproject.commoncode.converter;

import com.sds.baseproject.commoncode.CommonCode;
import jakarta.persistence.AttributeConverter;
import org.springframework.util.StringUtils;

import java.util.Arrays;

/**
 * JPA에서 CommonCode Entity를 db에 string으로 저장하고 불러올 때 사용되는 Converter.
 *
 * @param <T>
 */
public class CommonCodeConverter<T extends Enum & CommonCode> implements AttributeConverter<T, String> {
    private final Class<T> clazz;

    public CommonCodeConverter(Class<T> clazz) {
        this.clazz = clazz;
    }

    @Override
    public String convertToDatabaseColumn(T attribute) {
        return attribute.getCode();
    }

    @Override
    public T convertToEntityAttribute(String dbData) {
        if (!StringUtils.hasText(dbData)) {
            return null;
        }
        return Arrays.stream(clazz.getEnumConstants())
                .filter(e -> e.getCode().equals(dbData))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown code: " + dbData));
    }
}
