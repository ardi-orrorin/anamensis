package com.anamensis.server.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.IOException;

@RestController
@RequestMapping("public/api/test")
@RequiredArgsConstructor
@Slf4j
public class TestController {

    private final S3Client s3Client;

    @GetMapping(value = "", produces = MediaType.IMAGE_JPEG_VALUE)
    public Mono<InputStreamResource> test() throws IOException {

        String bucket = "anamensis";
        String key = "1.jpg";
        ResponseInputStream<GetObjectResponse> response = s3Client.getObject(r ->
                r.bucket(bucket).key(key));

        log.info("response content-Type: {}", response.response().contentType());

//        log.info("response content: {}", response.response().);

        return Mono.just(new InputStreamResource(response));
    }

}
