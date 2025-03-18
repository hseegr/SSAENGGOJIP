package com.sds.baseproject.user.converter;

import com.sds.baseproject.commoncode.payload.CommonCodeSummarySimple;
import com.sds.baseproject.role.entity.UserRole;
import com.sds.baseproject.role.payload.RoleSummarySimple;
import com.sds.baseproject.user.code.Region;
import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.payload.UserRequest;
import com.sds.baseproject.user.payload.UserRequestForSso;
import com.sds.baseproject.user.payload.UserSummary;
import com.sds.baseproject.user.payload.UserSummaryForAuthentication;
import com.sds.baseproject.user.payload.UserSummarySimple;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-18T13:02:01+0900",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.7.jar, environment: Java 21.0.5 (Amazon.com Inc.)"
)
@Component
public class UserConverterImpl implements UserConverter {

    @Override
    public UserSummary toUserSummary(User user) {
        if ( user == null ) {
            return null;
        }

        UserSummary userSummary = new UserSummary();

        userSummary.setRoles( userRoleListToRoleSummarySimpleList( user.getUserRoles() ) );
        userSummary.setUserId( user.getUserId() );
        userSummary.setLoginId( user.getLoginId() );
        userSummary.setName( user.getName() );
        userSummary.setRegionCd( user.getRegionCd() );
        userSummary.setRegion( regionToCommonCodeSummarySimple( user.getRegion() ) );
        userSummary.setDisabledYn( user.getDisabledYn() );
        userSummary.setRegUser( userToUserSummarySimple( user.getRegUser() ) );

        return userSummary;
    }

    @Override
    public UserSummaryForAuthentication toUserSummaryForAuthentication(User user) {
        if ( user == null ) {
            return null;
        }

        UserSummaryForAuthentication userSummaryForAuthentication = new UserSummaryForAuthentication();

        userSummaryForAuthentication.setRoles( toStringArray( user.getUserRoles() ) );
        userSummaryForAuthentication.setLoginId( user.getLoginId() );
        userSummaryForAuthentication.setName( user.getName() );

        return userSummaryForAuthentication;
    }

    @Override
    public User toUser(UserRequest userRequest) {
        if ( userRequest == null ) {
            return null;
        }

        User user = new User();

        user.setLoginId( userRequest.getLoginId() );
        user.setName( userRequest.getName() );
        user.setRegionCd( userRequest.getRegionCd() );
        user.setDisabledYn( userRequest.getDisabledYn() );

        return user;
    }

    @Override
    public User toUser(UserRequestForSso userRequest) {
        if ( userRequest == null ) {
            return null;
        }

        User user = new User();

        user.setUserId( userRequest.getUserId() );
        user.setLoginId( userRequest.getLoginId() );
        user.setName( userRequest.getName() );

        return user;
    }

    @Override
    public void updateUser(User user, UserRequest userRequest) {
        if ( userRequest == null ) {
            return;
        }

        user.setName( userRequest.getName() );
        user.setRegionCd( userRequest.getRegionCd() );
        user.setDisabledYn( userRequest.getDisabledYn() );
    }

    protected List<RoleSummarySimple> userRoleListToRoleSummarySimpleList(List<UserRole> list) {
        if ( list == null ) {
            return null;
        }

        List<RoleSummarySimple> list1 = new ArrayList<RoleSummarySimple>( list.size() );
        for ( UserRole userRole : list ) {
            list1.add( toRoleSummary( userRole ) );
        }

        return list1;
    }

    protected CommonCodeSummarySimple regionToCommonCodeSummarySimple(Region region) {
        if ( region == null ) {
            return null;
        }

        CommonCodeSummarySimple commonCodeSummarySimple = new CommonCodeSummarySimple();

        commonCodeSummarySimple.setCode( region.getCode() );
        commonCodeSummarySimple.setTitle( region.getTitle() );

        return commonCodeSummarySimple;
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
