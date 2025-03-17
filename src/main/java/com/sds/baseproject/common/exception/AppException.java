package com.sds.baseproject.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Application에서 발생하는 Exception을 공통처리 하기위한 Exception.
 * 실제 Exception은 관리자만 볼 수 있도록 log로 기록하고 사용자에게는 특정 message를 전달하는 목적으로 사용된다.
 * RestResponseEntityExceptionHandler 에서 AppException에 대한 처리를 담당하도록 설계되어있다.
 * cause 를 담을 경우 log에 기록, message만 존재할 경우 사용자에게 message만 전달한다.
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class AppException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public AppException(String message) {
        super(message);
    }

    public AppException(String message, Throwable cause) {
        super(message, cause);
    }
}
