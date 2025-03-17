package com.sds.baseproject.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serializable;

/**
 * 조건에 만족하는 Resource를 찾지 못했을때 처리를 위해 사용되는 Exception.
 * 의도적으로 404 응답을 뱉도록 사용된다.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private final String resourceName;
    private final String fieldName;
    private final Serializable fieldValue;

    /**
     * Use it when resource not Fount Exception Error.
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Serializable fieldValue) {
        super(String.format("%s for %s '%s' was not found.", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public Object getFieldValue() {
        return fieldValue;
    }
}
