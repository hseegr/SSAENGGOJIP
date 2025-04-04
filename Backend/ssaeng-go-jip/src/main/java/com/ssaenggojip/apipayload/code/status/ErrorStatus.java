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

    // 사용자 관련 에러
    ALREADY_JOIN(HttpStatus.BAD_REQUEST, "USER4004", "이미 %s로 로그인한 이메일입니다."),
    SAME_EMAIL(HttpStatus.BAD_REQUEST , "USER4001", "기존과 동일한 이메일입니다."),
    EMAIL_EXIST(HttpStatus.BAD_REQUEST, "USER4003", "이미 사용 중인 이메일입니다."),
    UNABLE_TO_SEND_EMAIL(HttpStatus.BAD_REQUEST, "USER4004", "이메일 전송에 실패하였습니다."),

    // 타겟 주소 관련 에러
    MAX_TARGET_ADDRESS(HttpStatus.BAD_REQUEST , "TARGETADDRESS4001", "이미 타겟 주소를 최대로 등록했습니다."),
    NOT_FOUND_TARGET_ADDRESS_ID(HttpStatus.BAD_REQUEST , "TARGETADDRESS4002", "해당하는 타겟 주소가 없습니다."),
    CANNOT_DELETE_DEFAULT_TARGET_ADDRESS(HttpStatus.BAD_REQUEST , "TARGETADDRESS4003", "기본 타겟 주소는 삭제할 수 없습니다."),

    // 채팅방 관련 에러
    NOT_FOUND_CHAT_ROOM_ID(HttpStatus.BAD_REQUEST , "CHATROOM4001", "해당하는 채팅방이 없습니다."),
    MAX_CHAT_ROOM_USER(HttpStatus.BAD_REQUEST , "CHATROOM4002", "채팅방 인원이 가득 찼습니다."),
    ALREADY_ENTER_CHAT_ROOM(HttpStatus.BAD_REQUEST , "CHATROOM4003", "이미 입장한 채팅방입니다."),
    ALREADY_LEAVE_CHAT_ROOM(HttpStatus.BAD_REQUEST , "CHATROOM4004", "참여한 적이 없거나 이미 퇴장한 채팅방입니다."),

    // 채팅 관련 에러
    NOT_FOUND_MESSAGE_ID(HttpStatus.BAD_REQUEST , "CHATMESSAGE4001", "해당하는 채팅 메세지가 없습니다."),
    ALREADY_REPORTED(HttpStatus.BAD_REQUEST , "CHATMESSAGE4002", "해당 유저가 이미 신고한 메세지입니다."),

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

    public ErrorReasonDto getReason(Object... args) {
        return ErrorReasonDto.builder()
                .message(String.format(message, args))
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

    public ErrorReasonDto getReasonHttpStatus(Object... args) {
        return ErrorReasonDto.builder()
                .message(String.format(message, args))
                .code(code)
                .isSuccess(false)
                .httpStatus(httpStatus)
                .build();
    }
}
