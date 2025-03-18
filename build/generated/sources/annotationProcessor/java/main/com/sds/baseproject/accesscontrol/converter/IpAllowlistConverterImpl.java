package com.sds.baseproject.accesscontrol.converter;

import com.sds.baseproject.accesscontrol.entity.IpAllowlist;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistRequest;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSummary;
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
public class IpAllowlistConverterImpl implements IpAllowlistConverter {

    @Override
    public IpAllowlistSummary toIpAddressSummary(IpAllowlist ipAllowlist) {
        if ( ipAllowlist == null ) {
            return null;
        }

        IpAllowlistSummary ipAllowlistSummary = new IpAllowlistSummary();

        ipAllowlistSummary.setIpAddr( ipAllowlist.getIpAddr() );
        ipAllowlistSummary.setDescription( ipAllowlist.getDescription() );
        ipAllowlistSummary.setModUser( userToUserSummarySimple( ipAllowlist.getModUser() ) );
        ipAllowlistSummary.setModDatetime( ipAllowlist.getModDatetime() );

        return ipAllowlistSummary;
    }

    @Override
    public IpAllowlist toIpAddress(IpAllowlistRequest ipAllowlistRequest) {
        if ( ipAllowlistRequest == null ) {
            return null;
        }

        IpAllowlist ipAllowlist = new IpAllowlist();

        ipAllowlist.setIpAddr( ipAllowlistRequest.getIpAddr() );
        ipAllowlist.setDescription( ipAllowlistRequest.getDescription() );

        return ipAllowlist;
    }

    @Override
    public void updateIpAddress(IpAllowlist ipAllowlist, IpAllowlistRequest ipAllowlistRequest) {
        if ( ipAllowlistRequest == null ) {
            return;
        }

        ipAllowlist.setIpAddr( ipAllowlistRequest.getIpAddr() );
        ipAllowlist.setDescription( ipAllowlistRequest.getDescription() );
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
