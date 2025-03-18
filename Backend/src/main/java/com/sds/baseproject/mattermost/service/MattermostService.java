package com.sds.baseproject.mattermost.service;

import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.mattermost.payload.PostRequest;
import com.sds.baseproject.mattermost.payload.PostSummary;
import com.sds.baseproject.mattermost.payload.PostUpdateRequest;

public interface MattermostService {
  PostSummary getPost(String postId);

  ApiResponse createPost(PostRequest request);

  ApiResponse putPost(PostUpdateRequest request);

  ApiResponse deletePost(String postId);
}
