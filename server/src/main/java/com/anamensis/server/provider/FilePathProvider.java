package com.anamensis.server.provider;


import com.anamensis.server.dto.FilePathDto;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Component
public class FilePathProvider {

    public FilePathDto changeContentPath(int width, int height, String ext) {
        String path = "/resource/board/";
        String filename = UUID.randomUUID().toString();
        String oriFilename = String.format("%s.%s", filename, ext);
//        String thumbFilename = String.format("%s_%sx%s.%s", filename, width, height, ext);

        return new FilePathDto(path, oriFilename, width, height);
    }


    public FilePathDto changeUserPath(RootType root, String userPk, int width, int height, String ext) {
        String result = "";
        String filename = String.format("%s_%sx%s.%s",UUID.randomUUID(), width, height, ext);

        String profile = String.format("/user/%s/profile/%s/", userPk,
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
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
