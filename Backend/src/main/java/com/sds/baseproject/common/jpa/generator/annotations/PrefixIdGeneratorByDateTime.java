package com.sds.baseproject.common.jpa.generator.annotations;

import org.hibernate.annotations.IdGeneratorType;
import org.hibernate.annotations.ValueGenerationType;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@IdGeneratorType(com.sds.baseproject.common.jpa.generator.PrefixIdGeneratorByDateTime.class)
@ValueGenerationType(generatedBy = com.sds.baseproject.common.jpa.generator.PrefixIdGeneratorByDateTime.class)
@Retention(RUNTIME)
@Target({FIELD, METHOD})
public @interface PrefixIdGeneratorByDateTime {
    String prefix();
}
