package com.sds.baseproject.file.provider.aws;


import com.amazonaws.services.s3.AmazonS3;


/**
 * AWS S3 Client 를 담기위한 abstract class 로 각 AWSCredentials 마다 상속을 통해 구현하도록 설계되어있다.
 * 예로 2개의 S3 를 이용하는 경우 AWSS3ClientProviderForAttachment, AWSS3ClientProviderForVideo 와 같이 두 가지로
 * 만들어 사용가능.
 */
public abstract class AWSS3ClientProvider {
    protected AmazonS3 amazonS3;

    public abstract AmazonS3 getS3Client();
}
