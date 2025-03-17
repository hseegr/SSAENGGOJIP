package com.sds.baseproject.file.storage;

import com.sds.baseproject.common.exception.AppException;
import com.sds.baseproject.file.util.ResourceHashUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Profile({"dev","local"})
@Service
public class LocalFileStorageService implements FileStorageService {
    @Value("${app.attachment.dir}")
    private String fileUploadPath = "";

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        File path = new File(fileUploadPath);
        if (path.isFile()) {
            throw new AppException("A file exists at upload path " + fileUploadPath);
        }
        if (!path.exists()) {
            if (!path.mkdirs()) {
                throw new AppException("Unable to create upload directory : " + fileUploadPath);
            }
        }

        String hash = ResourceHashUtil.generateHash(file.getInputStream());

        Path targetPath = this.getTargetPath(hash);

        File targetFile = targetPath.toFile();
        if (targetFile.exists()) {
            if (targetFile.length() != file.getSize()) {
                throw new AppException("For hash " + hash + " the file " + targetFile + " exists "
                        + "but has conflicting size. The size must be " + file.getSize() + " bytes, " + "but is "
                        + targetFile.length() + " bytes.");
            }
        } else {
            Files.createDirectories(this.getTargetDirPath(hash));
            Files.copy(file.getInputStream(), targetPath);
        }
        return hash;
    }

    @Override
    public byte[] getBytes(String hash) throws IOException {
        return Files.readAllBytes(this.getTargetPath(hash));
    }

    @Override
    public InputStream getInputStream(String hash) throws IOException {
        return Files.newInputStream(this.getTargetPath(hash));
    }

    @Override
    public void deleteFile(String hash) throws IOException {
        Files.delete(this.getTargetPath(hash));
    }

    private Path getTargetDirPath(String hash) {
        return Paths.get(fileUploadPath, ResourceHashUtil.getDirPath(hash));
    }

    private Path getTargetPath(String hash) {
        return Paths.get(fileUploadPath, ResourceHashUtil.getDirPath(hash), ResourceHashUtil.getFilePath(hash));
    }


}
