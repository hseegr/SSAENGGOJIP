package com.sds.baseproject.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = -339528590L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUser user = new QUser("user");

    public final QBaseEntity _super;

    public final BooleanPath disabled = createBoolean("disabled");

    public final StringPath disabledYn = createString("disabledYn");

    public final StringPath loginId = createString("loginId");

    //inherited
    public final DateTimePath<java.time.OffsetDateTime> modDatetime;

    //inherited
    public final StringPath modId;

    // inherited
    public final QUser modUser;

    public final StringPath name = createString("name");

    public final StringPath password = createString("password");

    //inherited
    public final DateTimePath<java.time.OffsetDateTime> regDatetime;

    //inherited
    public final StringPath regId;

    public final EnumPath<com.sds.baseproject.user.code.Region> region = createEnum("region", com.sds.baseproject.user.code.Region.class);

    public final StringPath regionCd = createString("regionCd");

    // inherited
    public final QUser regUser;

    public final StringPath userId = createString("userId");

    public final ListPath<com.sds.baseproject.role.entity.UserRole, com.sds.baseproject.role.entity.QUserRole> userRoles = this.<com.sds.baseproject.role.entity.UserRole, com.sds.baseproject.role.entity.QUserRole>createList("userRoles", com.sds.baseproject.role.entity.UserRole.class, com.sds.baseproject.role.entity.QUserRole.class, PathInits.DIRECT2);

    public QUser(String variable) {
        this(User.class, forVariable(variable), INITS);
    }

    public QUser(Path<? extends User> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUser(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUser(PathMetadata metadata, PathInits inits) {
        this(User.class, metadata, inits);
    }

    public QUser(Class<? extends User> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this._super = new QBaseEntity(type, metadata, inits);
        this.modDatetime = _super.modDatetime;
        this.modId = _super.modId;
        this.modUser = _super.modUser;
        this.regDatetime = _super.regDatetime;
        this.regId = _super.regId;
        this.regUser = _super.regUser;
    }

}

