package com.sds.baseproject.file.controller;

import com.sds.baseproject.common.security.jwt.JwtProviderForSpringSecurity;
import com.sds.baseproject.file.payload.AttachmentFileSummaryWithStream;
import com.sds.baseproject.file.payload.UploadFileResponse;
import com.sds.baseproject.file.service.AttachmentFileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * 첨부파일 upload, download 를 위한 controller
 */
@RestController
@RequestMapping("/api/attachment-files")
@RequiredArgsConstructor
@Tag(name= "게시판 첨부파일 관리", description = "게시판 글에 첨부되어 있는 파일을 업로드하거나 다운로드할 수 있다. (Swagger에서 직접 실행할 수 없음)")
public class AttachmentFileController {
    private final AttachmentFileService attachmentFileService;

    private final JwtProviderForSpringSecurity jwtProvider;

    /**
     * 파일 다운로드를 위한 api
     * fileId, fileType 쌍이 실제 파일과 일치해야 다운이 가능하다.
     * accessToken 을 통하여 호출 사용자의 정보에 접근이 가능하며 유효한 토큰을 가진 요청만 다운로드가 가능하다.
     *
     * @param fileId
     * @param fileType
     * @param accessToken
     * @return
     * @throws IOException
     */
    @GetMapping("{fileId}/types/{fileType}/download")
    @Operation(summary = "게시판 첨부파일 다운로드", description = "공지사항 또는 자유게시판의 글에 첨부되어 있는 파일을 다운로드한다. (Swagger에서 직접 실행할 수 없음)")
    @ApiResponse(description = "첨부파일 다운로드 완료")
    public ResponseEntity<InputStreamResource> downloadAttachmentFileAsStream(
            @Parameter(description = "다운로드할 파일의 ID")
            @PathVariable String fileId,
            @Parameter(description = "다운로드할 파일의 게시판 타입 (notice : 공지사항, free : 자유게시판)")
            @PathVariable String fileType,
            @Parameter(description = "인증을 위한 토큰")
            @RequestParam String accessToken) throws IOException {

        if (!jwtProvider.validateToken(accessToken)) {
            throw new BadCredentialsException("Invalid Token");
        }

        AttachmentFileSummaryWithStream summary = this.attachmentFileService.getAttachmentFileWithInputStream(fileId,
                fileType);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + URLEncoder.encode(summary.getFileName(), StandardCharsets.UTF_8))
                .contentLength(summary.getFileSize())
                .contentType(summary.getMediaType())
                .body(new InputStreamResource(summary.getInputStream()));
    }

    @PostMapping
    @Operation(summary = "게시판 첨부파일 업데이트", description = "공지사항 또는 자유게시판의 글에 첨부되어 있는 파일을 업데이트한다. (Swagger에서 직접 실행할 수 없음)")
    @ApiResponse(description = "게시판 첨부파일 업데이트 완료")
    public ResponseEntity<UploadFileResponse> uploadAttachmentFile(
            @Parameter(description = "업데이트할 파일의 정보")
            @RequestParam MultipartFile file,
            @Parameter(description = "업데이트할 파일의 게시판 타입 (notice : 공지사항, free : 자유게시판)")
            @RequestParam String fileType,
            @Parameter(description = "첨부파일의 게시판 ID")
            @RequestParam(required = false) String refId
    ) throws IOException {
        return ResponseEntity.ok(this.attachmentFileService.uploadFile(file, fileType, refId));
    }
}
