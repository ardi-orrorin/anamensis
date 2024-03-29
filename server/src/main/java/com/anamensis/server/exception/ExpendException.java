package com.anamensis.server.exception;

import org.springframework.http.HttpStatus;

public class ExpendException extends RuntimeException{

    private final HttpStatus status;
        public ExpendException(String message, HttpStatus status) {
            super(message);
            this.status = status;
        }

        public HttpStatus getStatus() {
            return status;
        }
}
