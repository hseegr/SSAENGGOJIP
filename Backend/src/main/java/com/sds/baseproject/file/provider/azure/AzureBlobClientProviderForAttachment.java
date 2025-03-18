package com.sds.baseproject.file.provider.azure;

import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;


@Profile({"azure"})
@Component
public class AzureBlobClientProviderForAttachment extends AzureBlobClientProvider {

    @Value("${cloud.azure.storage.blob.endpoint}")
    private String endPoint = "";

    @Value("${cloud.azure.storage.blob.container}")
    private String fileContainer = "";

    @PostConstruct
    private void init() {
        this.containerClient =
                new BlobServiceClientBuilder()
                        .endpoint(endPoint)
                        .credential(new ManagedIdentityCredentialBuilder().build())
                        .buildClient()
                        .getBlobContainerClient(fileContainer);

    }

    @Override
    public BlobClient getBlobClient(String blobName) {
        return containerClient.getBlobClient(blobName);
    }
}
