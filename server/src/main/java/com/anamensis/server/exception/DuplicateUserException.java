package com.anamensis.server.exception;

import org.springframework.http.HttpStatus;

public class DuplicateUserException extends ExpendException{

    public DuplicateUserException(String message, HttpStatus status) {
        super(message, status);
    }
}
