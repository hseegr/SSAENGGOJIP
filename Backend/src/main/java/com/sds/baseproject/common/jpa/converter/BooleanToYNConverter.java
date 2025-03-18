package com.sds.baseproject.common.jpa.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * DB에 "Y", "N" 으로 기록되는 필드를 Java에서 boolean으로 활용하기 위한 Converter.
 * Service 로직에서 if("Y".equals(entity.deletedYn)) 으로 비교해야 하는것을 if(entity.isDeleted) 의 형태로 사용할 수 있도록 하는 용도로 사용된다.
 */
@Converter
public class BooleanToYNConverter implements AttributeConverter<Boolean, String> {
    @Override
    public String convertToDatabaseColumn(Boolean attribute) {
        return (attribute != null && attribute) ? "Y" : "N";
    }

    @Override
    public Boolean convertToEntityAttribute(String dbData) {
        return "Y".equals(dbData);
    }
}
