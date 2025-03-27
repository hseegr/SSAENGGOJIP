package com.ssaenggojip.common.utils;

import com.pgvector.PGvector;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.postgresql.util.PGobject;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

@Converter(autoApply = true)
public class PGVectorConverter implements AttributeConverter<float[], String> {

    @Override
    public String convertToDatabaseColumn(float[] attribute) {
        if (attribute == null) {
            return "'[]'";
        }

        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("'[");

        for (int i = 0; i < attribute.length; i++) {
            stringBuilder.append(attribute[i]);
            if (i < attribute.length - 1) {
                stringBuilder.append(", ");
            }
        }

        stringBuilder.append("]'");
        return stringBuilder.toString();
    }

    @Override
    public float[] convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new float[0];
        }

        String[] values = dbData.substring(2, dbData.length() - 2).split(", ");

        float[] embeddingList = new float[values.length];
        for (int i = 0; i < values.length; i++) {
            embeddingList[i] = Float.parseFloat(values[i]);
        }

        return embeddingList;
    }
}
