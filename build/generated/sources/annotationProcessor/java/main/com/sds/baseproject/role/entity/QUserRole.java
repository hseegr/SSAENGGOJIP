package com.sds.baseproject.role.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUserRole is a Querydsl query type for UserRole
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserRole extends EntityPathBase<UserRole> {

    private static final long serialVersionUID = -1891336525L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUserRole userRole = new QUserRole("userRole");

    public final com.sds.baseproject.user.entity.QBaseEntity _super;

    public final NumberPath<Long> id = createNumber("id", Long.class);

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

    public final QRole role;

    public final StringPath roleId = createString("roleId");

    public final com.sds.baseproject.user.entity.QUser user;

    public final StringPath userId = createString("userId");

    public QUserRole(String variable) {
        this(UserRole.class, forVariable(variable), INITS);
    }

    public QUserRole(Path<? extends UserRole> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUserRole(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUserRole(PathMetadata metadata, PathInits inits) {
        this(UserRole.class, metadata, inits);
    }

    public QUserRole(Class<? extends UserRole> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this._super = new com.sds.baseproject.user.entity.QBaseEntity(type, metadata, inits);
        this.modDatetime = _super.modDatetime;
        this.modId = _super.modId;
        this.modUser = _super.modUser;
        this.regDatetime = _super.regDatetime;
        this.regId = _super.regId;
        this.regUser = _super.regUser;
        this.role = inits.isInitialized("role") ? new QRole(forProperty("role"), inits.get("role")) : null;
        this.user = inits.isInitialized("user") ? new com.sds.baseproject.user.entity.QUser(forProperty("user"), inits.get("user")) : null;
    }

}

