package com.anamensis.server.exception;

import org.springframework.http.HttpStatus;

public class AuthorizationException extends ExpendException {
    public AuthorizationException(String message, HttpStatus status) {
        super(message, status);
    }
}
