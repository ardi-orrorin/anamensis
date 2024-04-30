package com.anamensis.server.provider;


import com.anamensis.server.dto.FilePathDto;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class FilePathProvider {

    public FilePathDto changePath(RootType root, String userPk, int width, int height, String ext) {
        String result = "";
        String filename = String.format("%s_%sx%s.%s",UUID.randomUUID(), width, height, ext);

        String profile = String.format("/user/%s/profile/%s/%s",
                userPk,
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                filename
        );

        String resource = String.format("/user/%s/resource/%s/%s", userPk, width, height);

        switch (root) {
            case PROFILE -> result = profile;
            case RESOURCE -> result = resource;
        }

        return new FilePathDto(result, filename, width, height);
    }

    public enum RootType {
        PROFILE,
        RESOURCE
    }
}
