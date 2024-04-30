package com.anamensis.server.service;

import com.anamensis.server.dto.FilePathDto;
import com.anamensis.server.entity.File;
import com.anamensis.server.entity.User;
import com.anamensis.server.mapper.FileMapper;
import com.anamensis.server.provider.FilePathProvider;
import com.anamensis.server.provider.FileProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final FileProvider fileProvider;

    private final FileMapper fileMapper;

    private final S3Client s3Client;

    private final FilePathProvider filePathProvider;

    public File selectByFileName(String fileName) {
        return fileMapper.selectByFileName(fileName)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    @Transactional
    public Mono<Boolean> insert(FilePart filePart, File file) {
        return fileProvider.save(filePart, file)
                .map(fileMapper::insert)
                .map(this::response)
                .onErrorMap(RuntimeException::new);
    }


    private boolean response(int result) {
        if (result == 0) {
            throw new RuntimeException("File insert failed");
        }
        return true;
    }


    public Mono<String> saveProfile(User user, FilePart filePart) {

        String ext = filePart.filename().substring(filePart.filename().lastIndexOf(".") + 1);

        FilePathDto filepath = filePathProvider.changePath(
                FilePathProvider.RootType.PROFILE,
                String.valueOf(user.getId()),
                200,200, ext
        );

        File fileEntity = File.builder()
                .fileName(filepath.file())
                .filePath(filepath.path())
                .orgFileName(filePart.filename())
                .tableCodePk(1)
                .tableRefPk(user.getId())
                .createAt(LocalDateTime.now())
                .build();

        return DataBufferUtils.join(filePart.content())
                .flatMap(b -> saveS3(filePart, b, filepath.path()))
                .then(Mono.fromCallable(() -> fileMapper.insert(fileEntity)))
                .then(Mono.just(filepath.path()));
    }

    private Mono<Void> saveS3(FilePart filePart, DataBuffer data, String path) {
        PutObjectRequest req = PutObjectRequest.builder()
                .bucket("anamensis")
                .key(path.substring(1))
                .contentType(filePart.headers().getContentType().getType())
                .build();

        s3Client.putObject(req, RequestBody.fromInputStream(data.asInputStream(), data.readableByteCount()));

        return Mono.empty();
    }
}



