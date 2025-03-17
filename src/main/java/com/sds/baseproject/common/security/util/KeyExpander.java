package com.sds.baseproject.common.security.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * JWT HMAC-SHA algorithm 에서는 최소 32자 이상의 key 를 사용하도록 요구한다.
 * 이때 실제 키를 32자 이상으로 만들기 어려울 때 기존의 키를 반복하여 원하는 길이로 맞춰주는 역할을 하는 클래스
 */
public class KeyExpander {
    public static byte[] expandKey(byte[] originalKey, int length) {
        MessageDigest digest = null;
        try {
            digest = MessageDigest.getInstance("SHA-512");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        byte[] expandedKey = new byte[length];
        byte[] hash = originalKey;

        for (int i = 0; i < length; i += hash.length) {
            hash = digest.digest(hash);
            System.arraycopy(hash, 0, expandedKey, i, Math.min(hash.length, length - i));
        }

        return expandedKey;
    }
}
