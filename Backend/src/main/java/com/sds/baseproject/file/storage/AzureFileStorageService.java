package com.sds.baseproject.file.storage;

import com.azure.storage.blob.BlobClient;
import com.sds.baseproject.common.exception.AppException;
import com.sds.baseproject.file.provider.azure.AzureBlobClientProviderForAttachment;
import com.sds.baseproject.file.util.ResourceHashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;

@Profile({"azure"})
@Service
@RequiredArgsConstructor
public class AzureFileStorageService implements FileStorageService {

    private final AzureBlobClientProviderForAttachment azureBlobClientProviderForAttachment;

    @Override
    public String uploadFile(MultipartFile file) throws IOException {

        String hash = ResourceHashUtil.generateHash(file.getInputStream());
        BlobClient blobClient = this.azureBlobClientProviderForAttachment.getBlobClient(this.getTargetPath(hash));
        if (Boolean.TRUE.equals(blobClient.exists())) {
            long targetLength = blobClient.downloadContent().getLength();

            if (targetLength != file.getSize()) {
                throw new AppException("For hash " + hash + " the file " + blobClient + " exists "
                        + "but has conflicting size. The size must be " + file.getSize() + " bytes, " + "but is "
                        + targetLength + " bytes.");
            }
        } else {
            blobClient.upload(file.getInputStream(), file.getSize(), true);
        }
        return hash;
    }

    @Override
    public byte[] getBytes(String hash) {
        BlobClient blobClient = this.azureBlobClientProviderForAttachment.getBlobClient(this.getTargetPath(hash));
        return blobClient.downloadContent().toBytes();
    }

    @Override
    public InputStream getInputStream(String hash) {
        BlobClient blobClient = this.azureBlobClientProviderForAttachment.getBlobClient(this.getTargetPath(hash));
        return blobClient.downloadContent().toStream();
    }

    @Override
    public void deleteFile(String hash) {
        BlobClient blobClient = this.azureBlobClientProviderForAttachment.getBlobClient(this.getTargetPath(hash));
        blobClient.deleteIfExists();
    }

    private String getTargetPath(String hash) {
        return Paths.get(ResourceHashUtil.getDirPath(hash), ResourceHashUtil.getFilePath(hash)).toString();
    }


}
