package com.sds.baseproject.accesscontrol.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QIpAllowlist is a Querydsl query type for IpAllowlist
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QIpAllowlist extends EntityPathBase<IpAllowlist> {

    private static final long serialVersionUID = -1058846231L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QIpAllowlist ipAllowlist = new QIpAllowlist("ipAllowlist");

    public final com.sds.baseproject.user.entity.QBaseEntity _super;

    public final StringPath description = createString("description");

    public final StringPath ipAddr = createString("ipAddr");

    //inherited
    public final DateTimePath<java.time.OffsetDateTime> modDatetime;

    //inherited
    public final StringPath modId;

    // inherited
    public final com.sds.baseproject.user.entity.QUser modUser;

    //inherited
    public final DateTimePath<java.time.OffsetDateTime> regDatetime;

    //inherited
    public final StringPath regId;

    // inherited
    public final com.sds.baseproject.user.entity.QUser regUser;

    public QIpAllowlist(String variable) {
        this(IpAllowlist.class, forVariable(variable), INITS);
    }

    public QIpAllowlist(Path<? extends IpAllowlist> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QIpAllowlist(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QIpAllowlist(PathMetadata metadata, PathInits inits) {
        this(IpAllowlist.class, metadata, inits);
    }

    public QIpAllowlist(Class<? extends IpAllowlist> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this._super = new com.sds.baseproject.user.entity.QBaseEntity(type, metadata, inits);
        this.modDatetime = _super.modDatetime;
        this.modId = _super.modId;
        this.modUser = _super.modUser;
        this.regDatetime = _super.regDatetime;
        this.regId = _super.regId;
        this.regUser = _super.regUser;
    }

}

