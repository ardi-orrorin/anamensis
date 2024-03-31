package com.anamensis.server.provider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class FileProvider {
    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;

    public Mono<com.anamensis.server.entity.File> save(
            FilePart filePart,
            com.anamensis.server.entity.File file
    ) {
        String filename = filePart.filename();
        String ext = filename.substring(filename.lastIndexOf(".") + 1);
        String filename2 = UUID.randomUUID() + "." + ext;
        String subDir = "/" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "/";

        File save = new File(UPLOAD_DIR + subDir + filename2);

        try {
            save.createNewFile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return filePart.transferTo(save)
                .map(r -> {
                        file.setFileName(filename2);
                        file.setOrgFileName(filename);
                        file.setCreateAt(LocalDateTime.now());
                        file.setFilePath(subDir);
                        return file;
                });

    }

}
