package com.sds.baseproject.error.converter;

import com.sds.baseproject.error.entity.Error;
import com.sds.baseproject.error.payload.ErrorDetail;
import com.sds.baseproject.error.payload.ErrorSummary;
import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.payload.UserSummarySimple;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-18T13:02:01+0900",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.7.jar, environment: Java 21.0.5 (Amazon.com Inc.)"
)
@Component
public class ErrorConverterImpl implements ErrorConverter {

    @Override
    public ErrorDetail toErrorDetail(Error error) {
        if ( error == null ) {
            return null;
        }

        ErrorDetail errorDetail = new ErrorDetail();

        errorDetail.setErrorId( error.getErrorId() );
        errorDetail.setMessage( error.getMessage() );
        errorDetail.setStacktrace( error.getStacktrace() );
        errorDetail.setRegUser( userToUserSummarySimple( error.getRegUser() ) );
        errorDetail.setRegDatetime( error.getRegDatetime() );

        return errorDetail;
    }

    @Override
    public ErrorSummary toErrorSummary(Error error) {
        if ( error == null ) {
            return null;
        }

        ErrorSummary errorSummary = new ErrorSummary();

        errorSummary.setErrorId( error.getErrorId() );
        errorSummary.setMessage( error.getMessage() );
        errorSummary.setRegUser( userToUserSummarySimple( error.getRegUser() ) );
        errorSummary.setRegDatetime( error.getRegDatetime() );

        return errorSummary;
    }

    protected UserSummarySimple userToUserSummarySimple(User user) {
        if ( user == null ) {
            return null;
        }

        UserSummarySimple userSummarySimple = new UserSummarySimple();

        userSummarySimple.setUserId( user.getUserId() );
        userSummarySimple.setLoginId( user.getLoginId() );
        userSummarySimple.setName( user.getName() );

        return userSummarySimple;
    }
}
