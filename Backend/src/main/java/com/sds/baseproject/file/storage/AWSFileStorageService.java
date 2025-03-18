package com.sds.baseproject.file.storage;

import com.amazonaws.services.s3.model.*;
import com.sds.baseproject.file.provider.aws.AWSS3ClientProviderForAttachment;
import com.sds.baseproject.file.util.ResourceHashUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;

@Profile({"aws"})
@Service
@RequiredArgsConstructor
public class AWSFileStorageService implements FileStorageService {
    private final AWSS3ClientProviderForAttachment awsS3ClientProviderForAttachment;
    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket = "";

    @Value("${app.cloud.aws.s3.key.prefix}")
    private String keyPrefix = "";

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        String hash = ResourceHashUtil.generateHash(file.getInputStream());
        ObjectMetadata objectMetaData = new ObjectMetadata();
        objectMetaData.setContentType(file.getContentType());
        objectMetaData.setContentLength(file.getSize());
        awsS3ClientProviderForAttachment.getS3Client().putObject(new PutObjectRequest(bucket,
                this.getTargetPath(hash), file.getInputStream(), objectMetaData));

        return hash;
    }

    @Override
    public byte[] getBytes(String hash) throws IOException {
        S3Object object =
                awsS3ClientProviderForAttachment.getS3Client().getObject(new GetObjectRequest(bucket, this.getTargetPath(hash)));
        S3ObjectInputStream objectInputStream = object.getObjectContent();
        return IOUtils.toByteArray(objectInputStream);
    }

    @Override
    public InputStream getInputStream(String hash) {

        S3Object object =
                awsS3ClientProviderForAttachment.getS3Client().getObject(new GetObjectRequest(bucket, this.getTargetPath(hash)));
        return object.getObjectContent();
    }

    @Override
    public void deleteFile(String hash) {
        this.awsS3ClientProviderForAttachment.getS3Client().deleteObject(new DeleteObjectRequest(bucket,
                this.getTargetPath(hash)));
    }

    private String getTargetPath(String hash) {
        return Paths.get(keyPrefix, ResourceHashUtil.getDirPath(hash), ResourceHashUtil.getFilePath(hash)).toString();
    }
}