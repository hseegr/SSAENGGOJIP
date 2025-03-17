package com.sds.baseproject.file.provider.azure;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;

/**
 * Azure Blob Client 를 담기위한 abstract class 로 각 endpoint-container 마다 상속을 통해 구현하도록 설계되어있다.
 * 예로 2개의 blob 을 이용하는 경우 AzureBlobClientProviderForAttachment, AzureBlobClientProviderForVideo 와 같이 두 가지로
 * 만들어 사용가능.
 */
public abstract class AzureBlobClientProvider {
    protected BlobContainerClient containerClient;

    public abstract BlobClient getBlobClient(String blobName);
}
