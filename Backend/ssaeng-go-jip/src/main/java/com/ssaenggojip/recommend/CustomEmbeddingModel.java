package com.ssaenggojip.recommend;

import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;

public class CustomEmbeddingModel implements EmbeddingModel {
    @Override
    public EmbeddingResponse call(EmbeddingRequest request) {
        return null;
    }

    @Override
    public float[] embed(Document document) {
        return new float[0];
    }
}
