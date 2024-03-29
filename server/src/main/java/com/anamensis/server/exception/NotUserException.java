package com.anamensis.server.exception;

import org.springframework.http.HttpStatus;

public class NotUserException extends ExpendException{

    public NotUserException(String message, HttpStatus status) {
        super(message, status);
    }
}
