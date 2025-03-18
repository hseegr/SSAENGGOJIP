package com.sds.baseproject.file.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 *
 */
public interface FileStorageService {
    String uploadFile(MultipartFile file) throws IOException;

    byte[] getBytes(String hash) throws IOException;

    InputStream getInputStream(String hash) throws IOException;

    void deleteFile(String hash) throws IOException;
}
