package com.ssaenggojip.apipayload.code.status;

import com.ssaenggojip.apipayload.code.BaseErrorCode;
import com.ssaenggojip.apipayload.code.ErrorReasonDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
    // 가장 일반적인 응답
    _INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON500", "서버 에러, 관리자에게 문의 바랍니다."),
    _BAD_REQUEST(HttpStatus.BAD_REQUEST,"COMMON400","잘못된 요청입니다."),
    _UNAUTHORIZED(HttpStatus.UNAUTHORIZED,"COMMON401","인증이 필요합니다."),
    _FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON403", "금지된 요청입니다."),

    // 로그인 관련 에러
    UNABLE_TO_GET_USER_INFO(HttpStatus.BAD_REQUEST, "LOGIN4001", "소셜 로그인 공급자로부터 유저 정보를 받아올 수 없습니다."),
    UNABLE_TO_GET_ACCESS_TOKEN(HttpStatus.BAD_REQUEST , "LOGIN4002", "소셜 로그인 공급자로부터 인증 토큰을 받아올 수 없습니다."),
    NOT_FOUND_USER_ID(HttpStatus.BAD_REQUEST , "LOGIN4003", "요청 ID에 해당하는 유저가 존재하지 않습니다."),
    INVALID_SOCIAL_PROVIDER(HttpStatus.BAD_REQUEST , "LOGIN4004", "유효하지 않은 소셜 로그인 공급자입니다."),
    FAILED_TO_GENERATE_NICKNAME(HttpStatus.BAD_REQUEST , "LOGIN4005", "중복되지 않는 닉네임을 생성하지 못했습니다."),

    // 토큰 관련 에러
    INVALID_REFRESH_TOKEN(HttpStatus.BAD_REQUEST , "TOKEN4001", "유효하지 않은 Refresh Token입니다."),
    FAILED_TO_VALIDATE_TOKEN(HttpStatus.BAD_REQUEST , "TOKEN4002", "토큰 검증에 실패했습니다."),
    INVALID_ACCESS_TOKEN(HttpStatus.BAD_REQUEST , "TOKEN4003", "유효하지 않은 Access Token입니다."),

    // 부동산 관련 에러
    UNABLE_TO_GET_PROPERTY_INFO(HttpStatus.BAD_REQUEST, "PROPERTY4001", "존재하지 않는 부동산 입니다."),
    
    // 역 관련 에러
    UNABLE_TO_GET_STATION_INFO(HttpStatus.BAD_REQUEST, "STATION4001", "존재하지 않는 역 입니다."),
    NO_STATION_NEAR_POINT(HttpStatus.NOT_FOUND, "STATION4004", "좌표 주변 2km 이내에 역이 없습니다"),
    NO_STATION_TO_STATION_MAPPER(HttpStatus.NOT_FOUND, "STATION4004", "역 과 역을 이어주는 테이블이 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDto getReason(){
        return ErrorReasonDto.builder()
                .message(message)
                .code(code)
                .isSuccess(false)
                .build();
    }

    @Override
    public ErrorReasonDto getReasonHttpStatus(){
        return ErrorReasonDto.builder()
                .message(message)
                .code(code)
                .isSuccess(false)
                .httpStatus(httpStatus)
                .build();
    }
}
