package com.anamensis.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.io.File;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class FileRouterConfig {

    @Value("${file.storage.dir}")
    private String FILE_STORAGE_DIR;

    @Value("${spring.cloud.aws.s3.active}")
    private boolean ACTIVE_S3;

    @Bean
    public RouterFunction<ServerResponse> fileRouterFunction() {
        if(ACTIVE_S3) return null;

        return route()
            .GET("/files/**", request -> {
                String filename = request.path().substring("/files".length());

                File file = new File(FILE_STORAGE_DIR + filename);
                if (!file.exists()) {
                    return ServerResponse.notFound().build();
                }

                FileSystemResource resource = new FileSystemResource(file);

                return ServerResponse.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .bodyValue(resource);
            })
            .build();
    }

}
