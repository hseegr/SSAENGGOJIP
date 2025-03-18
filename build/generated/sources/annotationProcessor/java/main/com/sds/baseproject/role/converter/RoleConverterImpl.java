package com.sds.baseproject.role.converter;

import com.sds.baseproject.role.entity.Role;
import com.sds.baseproject.role.entity.UserRole;
import com.sds.baseproject.role.payload.RoleRequest;
import com.sds.baseproject.role.payload.RoleSummary;
import com.sds.baseproject.role.payload.RoleSummaryForList;
import com.sds.baseproject.role.payload.RoleSummarySimple;
import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.payload.UserSummarySimple;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-18T13:02:01+0900",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.7.jar, environment: Java 21.0.5 (Amazon.com Inc.)"
)
@Component
public class RoleConverterImpl implements RoleConverter {

    @Override
    public RoleSummary toRoleSummary(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleSummary roleSummary = new RoleSummary();

        roleSummary.setUsers( userRoleSetToUserSummarySimpleList( role.getUserRoles() ) );
        roleSummary.setRoleId( role.getRoleId() );
        roleSummary.setDescription( role.getDescription() );
        roleSummary.setModDatetime( role.getModDatetime() );
        roleSummary.setModUser( toUserSummary( role.getModUser() ) );

        return roleSummary;
    }

    @Override
    public RoleSummaryForList toRoleSummaryForList(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleSummaryForList roleSummaryForList = new RoleSummaryForList();

        roleSummaryForList.setRoleId( role.getRoleId() );
        roleSummaryForList.setDescription( role.getDescription() );
        roleSummaryForList.setModDatetime( role.getModDatetime() );
        roleSummaryForList.setModUser( toUserSummary( role.getModUser() ) );

        return roleSummaryForList;
    }

    @Override
    public RoleSummarySimple toRoleSimple(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleSummarySimple roleSummarySimple = new RoleSummarySimple();

        roleSummarySimple.setRoleId( role.getRoleId() );
        roleSummarySimple.setDescription( role.getDescription() );

        return roleSummarySimple;
    }

    @Override
    public Role toRole(RoleRequest roleDetail) {
        if ( roleDetail == null ) {
            return null;
        }

        Role role = new Role();

        role.setDescription( roleDetail.getDescription() );

        return role;
    }

    @Override
    public UserSummarySimple toUserSummary(User user) {
        if ( user == null ) {
            return null;
        }

        UserSummarySimple userSummarySimple = new UserSummarySimple();

        userSummarySimple.setUserId( user.getUserId() );
        userSummarySimple.setLoginId( user.getLoginId() );
        userSummarySimple.setName( user.getName() );

        return userSummarySimple;
    }

    protected List<UserSummarySimple> userRoleSetToUserSummarySimpleList(Set<UserRole> set) {
        if ( set == null ) {
            return null;
        }

        List<UserSummarySimple> list = new ArrayList<UserSummarySimple>( set.size() );
        for ( UserRole userRole : set ) {
            list.add( convertUser( userRole ) );
        }

        return list;
    }
}
