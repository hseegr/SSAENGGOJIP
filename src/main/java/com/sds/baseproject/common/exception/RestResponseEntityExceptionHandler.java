package com.sds.baseproject.common.exception;

import com.sds.baseproject.error.service.ErrorService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Rest 호출 중 Catch되지 않은 Exception을 처리하기 위한 Handler.
 * 특별한 사유가 없다면 Controller, Service, Repository에서는 Exception을 처리 하지 않는것을 원칙으로 한다.
 */
@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    private final ErrorService errorService;

    @ExceptionHandler(AppException.class)
    protected ResponseEntity<Object> handleAppException(AppException ex, WebRequest request) {
        if (ex.getCause() != null) {
            String message = StringUtils.hasText(ex.getCause().getMessage())
                    ? ex.getCause().getMessage()
                    : "Message is Empty in " + ex.getClass().toString();
            this.errorService.saveError(message, ex);
        }
        return handleExceptionInternal(ex, ex.getMessage(), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler(AuthenticationException.class)
    protected ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        Long errorId = this.errorService.saveError("AuthenticationException", ex);
        String bodyOfResponse =
                "사용자 인증에 실패하였습니다.\n관리자에게 문의 하시려면 ERROR ID와 함께\nQ&A 게시판에 남겨주세요.\n\nERROR ID : " + errorId;
        return handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        Long errorId = this.errorService.saveError("AccessDeniedException", ex);
        String bodyOfResponse =
                "해당 리소스에 접근 권한이 없습니다.\n관리자에게 문의 하시려면 ERROR ID와 함께\nQ&A 게시판에 남겨주세요.\n\nERROR ID : " + errorId;
        return handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.FORBIDDEN, request);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    protected ResponseEntity<Object> handleResourceNotFoundException(EntityNotFoundException ex,
                                                                     WebRequest request) {
        Long errorId = this.errorService.saveError("EntityNotFoundException", ex);
        String bodyOfResponse =
                "요청한 리소스를 찾지 못했습니다.\n관리자에게 문의 하시려면 ERROR ID와 함께\nQ&A 게시판에 남겨주세요.\n\nERROR ID : " + errorId;
        return handleExceptionInternal(
                ex, bodyOfResponse, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    protected ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex,
                                                                     WebRequest request) {
        Long errorId = this.errorService.saveError("ResourceNotFoundException", ex);
        String bodyOfResponse =
                "요청한 리소스를 찾지 못했습니다.\n관리자에게 문의 하시려면 ERROR ID와 함께\nQ&A 게시판에 남겨주세요.\n\nERROR ID : " + errorId;
        return handleExceptionInternal(
                ex, bodyOfResponse, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
        logger.error("Unhandled Exception", ex);
        Long errorId = this.errorService.saveError("", ex);
        String bodyOfResponse =
                "예상치 못한 에러가 발생하였습니다.\n관리자에게 문의 하시려면 ERROR ID와 함께\nQ&A 게시판에 남겨주세요.\n\nERROR ID : " + errorId;
        return handleExceptionInternal(
                ex, bodyOfResponse, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }
}
