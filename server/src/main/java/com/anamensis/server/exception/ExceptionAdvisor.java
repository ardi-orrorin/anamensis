package com.anamensis.server.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionAdvisor {


    @ExceptionHandler(NotUserException.class)
    public ResponseEntity<String> notUserException(NotUserException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<String> duplicateUserException(DuplicateUserException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }



}
