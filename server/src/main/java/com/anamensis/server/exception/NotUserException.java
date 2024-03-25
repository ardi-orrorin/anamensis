package com.anamensis.server.exception;

import org.springframework.http.HttpStatus;

public class NotUserException extends RuntimeException{

    private HttpStatus status;
    public NotUserException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
