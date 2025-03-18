package com.sds.baseproject.file.util;

import com.sds.baseproject.common.exception.AppException;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Stream 의 byte 내용을 이용하여 path 를 만들어주는 Util.
 * <p>
 * 입력받은 파일명을 기반으로 저장하면 파일명은 같으나 실제 내용이 다른 경우 처리가 모호해짐.
 * 파일 명이 다르나 실제 내용이 동일한 경우 중복 저장 시 공간 낭비를 하게됨.
 * <p>
 * 파일의 내용을 hashing 하여  path 를 만들게되면 파일이름은 다르지만 실제 내용이 같은 경우 한 번만 저장하여 사용 가능.
 * <p>
 * hashing 결과의 앞 2자리(DRI_LENGTH)를 폴더명으로 사용하여 관리하면 인덱싱 성능을 향상 시킬 수 있음.
 */
public class ResourceHashUtil {
    private static final int BUFFER_SIZE = 8192;
    private static final int DIR_LENGTH = 2;

    private ResourceHashUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static String generateHash(InputStream inputStream) throws IOException {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[BUFFER_SIZE];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                digest.update(buffer, 0, length);
            }
            byte[] hash = digest.digest();
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new AppException("Could not find the algorithm", e);
        }
    }

    public static String getDirPath(String hash) {
        if (!StringUtils.hasText(hash)) {
            throw new AppException("Hash is EMPTY");
        }

        return hash.substring(0, DIR_LENGTH);
    }

    public static String getFilePath(String hash) {
        if (!StringUtils.hasText(hash)) {
            throw new AppException("Hash is EMPTY");
        }

        return hash.substring(DIR_LENGTH);
    }
}
