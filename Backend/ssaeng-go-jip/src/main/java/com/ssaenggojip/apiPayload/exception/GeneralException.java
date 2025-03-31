package com.ssaenggojip.apiPayload.exception;

import com.ssaenggojip.apiPayload.code.BaseErrorCode;
import com.ssaenggojip.apiPayload.code.ErrorReasonDto;
import com.ssaenggojip.apiPayload.code.status.ErrorStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public class GeneralException extends RuntimeException{
    private BaseErrorCode code;
    private final Object[] args;  // 메시지 포맷에 들어갈 인자들

    public GeneralException(BaseErrorCode code, Object... args) {
        super(code.getReason().getMessage());
        this.code = code;
        this.args = args;
    }

    public ErrorReasonDto getErrorReason(){
        if (code instanceof ErrorStatus errorStatus && args != null && args.length > 0) {
            return errorStatus.getReason(args);
        }
        return this.code.getReason();
    }

    public ErrorReasonDto getErrorReasonHttpStatus(){
        if (code instanceof ErrorStatus errorStatus && args != null && args.length > 0) {
            return errorStatus.getReasonHttpStatus(args);
        }
        return this.code.getReasonHttpStatus();
    }
}