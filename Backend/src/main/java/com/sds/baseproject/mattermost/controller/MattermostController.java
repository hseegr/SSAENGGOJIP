package com.sds.baseproject.mattermost.controller;

import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.mattermost.payload.PostRequest;
import com.sds.baseproject.mattermost.payload.PostSummary;
import com.sds.baseproject.mattermost.payload.PostUpdateRequest;
import com.sds.baseproject.mattermost.service.MattermostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mm")
@Tag(name= "Mattermost", description = "MatterMost Post를 관리할 수 있습니다.")
public class MattermostController {
  private final MattermostService mattermostService;

  @GetMapping("/posts/{postId}")
  @Operation(summary = "MatterMost Post 조회", description = "MatterMost Post를 조회한다. (사전에 생성된 채널이 필요하며, Swagger에서 바로 실행할 수 없음)")
  @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "조회된 MatterMost Post 정보")
  public ResponseEntity<PostSummary> getPost(
          @Parameter(description = "조회할 MatterMost Post ID")
          @PathVariable String postId) {
    return ResponseEntity.ok(this.mattermostService.getPost(postId));
  }

  @PostMapping("/posts")
  @Operation(summary = "MatterMost Post 등록", description = "MatterMost Post를 등록한다. (사전에 생성된 채널이 필요하며, Swagger에서 바로 실행할 수 없음)")
  @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "MatterMost Post 등록 완료")
  public ResponseEntity<ApiResponse> createPost(
          @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "등록할 MatterMost Post 정보")
          @RequestBody PostRequest request) {
    return ResponseEntity.ok(this.mattermostService.createPost(request));
  }

  @PutMapping("/posts/{postId}")
  @Operation(summary = "MatterMost Post 수정", description = "MatterMost Post를 수정한다. (사전에 생성된 채널이 필요하며, Swagger에서 바로 실행할 수 없음)")
  @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "MatterMost Post 수정 완료")
  public ResponseEntity<ApiResponse> putPost(
          @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 MatterMost Post 정보")
          @RequestBody PostUpdateRequest request) {
    return ResponseEntity.ok(this.mattermostService.putPost(request));
  }

  @DeleteMapping("/posts/{postId}")
  @Operation(summary = "MatterMost Post 삭제", description = "MatterMost Post를 삭제한다. (사전에 생성된 채널이 필요하며, Swagger에서 바로 실행할 수 없음)")
  @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "MatterMost Post 삭제 완료")
  public ResponseEntity<ApiResponse> deletePost(
          @Parameter(description = "삭제할 MatterMost Post ID")
          @PathVariable String postId) {
    return ResponseEntity.ok(this.mattermostService.deletePost(postId));
  }
}
