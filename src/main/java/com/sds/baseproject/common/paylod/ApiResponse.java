package com.sds.baseproject.common.paylod;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

/**
 * POST, PUT, DELETE 등 성공/실패가 기반이 되는 응답에 사용하기 위한 payload.
 * success가 false인 경우는 에러(5XX)는 아니지만 어떤 이유에서 의도적으로 실패한 케이스를 표기할 때 유용하다.
 */
@Getter
@Setter
public class ApiResponse {
    private Boolean success;
    private HttpStatus status = HttpStatus.OK;
    private String message;
    private Object data;

    public ApiResponse(Boolean success) {
        this.success = success;
    }

    public ApiResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ApiResponse(Boolean success, HttpStatus status, String message) {
        this.success = success;
        this.status = status;
        this.message = message;
    }

    public ApiResponse(Boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(Boolean success, HttpStatus status, String message, Object data) {
        this.success = success;
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
