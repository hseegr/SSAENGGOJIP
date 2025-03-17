package com.sds.baseproject.mattermost.service;

import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.mattermost.payload.DeleteSummary;
import com.sds.baseproject.mattermost.payload.PostRequest;
import com.sds.baseproject.mattermost.payload.PostSummary;
import com.sds.baseproject.mattermost.payload.PostUpdateRequest;
import com.sds.baseproject.mattermost.util.MattermostUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * Mattermost API를 사용하여 비즈니스 로직을 구현한 Service.
 * MattermostUtil 호출을 통한 POST 단 건 조회, 생성, 삭제, 수정 기능만 예시로 제공.
 * Channel 생성, Team 조회 등의 Mattermost 서비스를 활용한 Application 기능 별도로 구현 필요.
 */
@Service
@RequiredArgsConstructor
public class MattermostServiceImpl implements MattermostService {
    private final MattermostUtil mattermostUtil;
    private static final String END_POINT_FOR_POST = "posts";

    /**
     * postId에 해당하는 Mattermost 게시물 정보를 1건 조회.
     *
     * @param postId 게시물 ID
     * @return 조회된 게시물 정보
     */
    @Override
    public PostSummary getPost(String postId) {
        ResponseEntity<PostSummary> response =
                this.mattermostUtil.callApi(
                        END_POINT_FOR_POST + "/" + postId, null, HttpMethod.GET, null, PostSummary.class);

        return response.getBody();
    }

    /**
     * 새로운 게시물을 1건 생성.
     *
     * @param request 생성할 게시물 정보
     * @return 생성 결과
     */
    @Override
    public ApiResponse createPost(PostRequest request) {
        ResponseEntity<PostSummary> response =
                this.mattermostUtil.callApi(
                        END_POINT_FOR_POST, null, HttpMethod.POST, request, PostSummary.class);

        boolean isSuccess = response.getStatusCode() == HttpStatus.CREATED;

        return new ApiResponse(
                isSuccess, HttpStatus.resolve(response.getStatusCode().value()), "", response.getBody());
    }

    /**
     * 기존 게시물을 수정.
     *
     * @param request 수정할 게시물 정보
     * @return 수정 결과
     */
    @Override
    public ApiResponse putPost(PostUpdateRequest request) {
        ResponseEntity<PostSummary> response =
                this.mattermostUtil.callApi(
                        END_POINT_FOR_POST + "/" + request.getId(),
                        null,
                        HttpMethod.PUT,
                        request,
                        PostSummary.class);

        boolean isSuccess = response.getStatusCode() == HttpStatus.OK;

        return new ApiResponse(
                isSuccess, HttpStatus.resolve(response.getStatusCode().value()), "", response.getBody());
    }

    /**
     * 생성된 게시물을 삭제.
     *
     * @param postId 삭제할 게시물 ID
     * @return 삭제 결과
     */
    @Override
    public ApiResponse deletePost(String postId) {
        ResponseEntity<DeleteSummary> response =
                this.mattermostUtil.callApi(
                        END_POINT_FOR_POST + "/" + postId, null, HttpMethod.DELETE, null, DeleteSummary.class);

        boolean isSuccess = response.getStatusCode() == HttpStatus.OK;

        return new ApiResponse(
                isSuccess, HttpStatus.resolve(response.getStatusCode().value()), "", response.getBody());
    }
}
