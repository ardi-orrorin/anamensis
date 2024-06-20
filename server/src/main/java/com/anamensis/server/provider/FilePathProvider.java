package com.anamensis.server.provider;


import com.anamensis.server.dto.FilePathDto;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Component
public class FilePathProvider {

    public FilePathDto getBoardContent(String filename) {
        String path = "/resource/board/";
        return new FilePathDto(path, getFilename(getExt(filename)));
    }


    public FilePathDto getProfile(String memberPk, String filepath) {
        String path = String.format("/user/%s/profile/%s/", memberPk,
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
        );

        return new FilePathDto(path, getFilename(getExt(filepath)));
    }

    public FilePathDto getResource(String memberPk, String filepath) {
        String path = String.format("/user/%s/resource/", memberPk);
        return new FilePathDto(path, getFilename(getExt(filepath)));
    }

    private String getExt(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    private String getFilename(String ext) {
        return String.format("%s.%s",UUID.randomUUID(), ext);
    }
}
