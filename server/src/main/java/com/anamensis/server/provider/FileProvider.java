package com.anamensis.server.provider;

import com.anamensis.server.dto.FileHashRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.FilePartEvent;
import org.springframework.http.codec.multipart.PartEvent;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Slf4j
public class FileProvider {
    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;

    public Mono<com.anamensis.server.entity.File> save(
            FilePart filePart,
            com.anamensis.server.entity.File file
    ) {
        MediaType mediaType = filePart.headers().getContentType();
        log.info("mediaType: {}", mediaType.getType());

        // todo: mediaType.getType() image 경우 썸네일 / 오리지널 두개 생성

        // todo: 이외 파일은 그냥 저장

        String filename = filePart.filename();
        String ext = filename.substring(filename.lastIndexOf(".") + 1);
        String filename2 = UUID.randomUUID() + "." + ext;
        String subDir = "/" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "/";

        File save = new File(UPLOAD_DIR + subDir + filename2);

        try {
            if(!save.getParentFile().exists()){
                save.getParentFile().mkdirs();
            }
            save.createNewFile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return filePart.transferTo(save)
                .then(Mono.fromCallable(() -> {
                        file.setFileName(filename2);
                        file.setOrgFileName(filename);
                        file.setCreateAt(LocalDateTime.now());
                        file.setFilePath(subDir);
                        return file;
                }));

    }

    public void pushProgress (
            AtomicInteger input,
            long length,
            AtomicInteger progress,
            int capacity,
            String hash,
            Sinks.Many<FileHashRecord> list
    ) {
        int cur = (int) Math.ceil((double) input.addAndGet(capacity) / (double) length * 100);

        if(progress.get() >= cur) return;
        progress.set(cur);

        Mono.just(new FileHashRecord(hash,  String.valueOf(cur)))
                .doOnNext(list::tryEmitNext)
                .subscribe();
    }

    public void saveFile(
            FilePartEvent filePartEvent,
            PartEvent part,
            AtomicInteger input,
            String hash
    ) throws IOException {
        String filepath = UPLOAD_DIR + hash + "/" + filePartEvent.filename();
        if (input.get() == 0) {
            java.io.File save = new java.io.File(filepath);

            if (save.exists()) save.delete();

            if (!save.getParentFile().exists()) save.getParentFile().mkdirs();
        }

        try (
            FileOutputStream outputStream = new FileOutputStream(filepath, true)
        ) {
            outputStream.write(filePartEvent.content().asInputStream().readAllBytes());
            DataBufferUtils.release(part.content());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
