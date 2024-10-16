package com.anamensis.server.config;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.io.File;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class FileRouter {

    @Value("${file.storage.dir}")
    private String FILE_STORAGE_DIR;

    @Value("${aws.active.s3}")
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
