package com.ssaenggojip.common.utils;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;

@Converter
public class PGVectorConverter implements AttributeConverter<float[], String> {
    @Override
    public String convertToDatabaseColumn(float[] attribute) {
        if (attribute == null) {
            return null;
        }
        return Arrays.toString(attribute)
                .replace("[", "{")
                .replace("]", "}");
    }

    @Override
    public float[] convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        String[] elements = dbData
                .replace("{", "")
                .replace("}", "")
                .split(",");
        float[] result = new float[elements.length];
        for (int i = 0; i < elements.length; i++) {
            result[i] = Float.parseFloat(elements[i]);
        }
        return result;
    }
}
