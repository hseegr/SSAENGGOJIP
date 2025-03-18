package com.sds.baseproject.role.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRole is a Querydsl query type for Role
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRole extends EntityPathBase<Role> {

    private static final long serialVersionUID = -267930296L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRole role = new QRole("role");

    public final com.sds.baseproject.user.entity.QBaseEntity _super;

    public final StringPath description = createString("description");

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

    public final StringPath roleId = createString("roleId");

    public final SetPath<UserRole, QUserRole> userRoles = this.<UserRole, QUserRole>createSet("userRoles", UserRole.class, QUserRole.class, PathInits.DIRECT2);

    public QRole(String variable) {
        this(Role.class, forVariable(variable), INITS);
    }

    public QRole(Path<? extends Role> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRole(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRole(PathMetadata metadata, PathInits inits) {
        this(Role.class, metadata, inits);
    }

    public QRole(Class<? extends Role> type, PathMetadata metadata, PathInits inits) {
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

