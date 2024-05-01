package com.anamensis.server.provider;

import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AwsS3Provider {

    private final S3Client s3Client;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    public Mono<Void> saveS3(FilePart filePart, String path, int width, int height)  {
        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucket)
                .key(path.substring(1))
                .contentType(filePart.headers().getContentType().getType())
                .build();

        return DataBufferUtils.join(filePart.content())
                .flatMap(data -> {
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

                    try {
                        Thumbnails.of(data.asInputStream())
                                .size(width, height)
                                .crop(Positions.CENTER)
                                .outputQuality(0.4)
                                .toOutputStream(outputStream);
                    } catch (IOException e) {
                        return Mono.error(new RuntimeException(e));
                    }

                    s3Client.putObject(req, RequestBody.fromBytes(outputStream.toByteArray()));

                    return Mono.empty();
                });
    }

    public Mono<Void> deleteS3(String filePath) {
        s3Client.deleteObject(
                DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(filePath.substring(1))
                        .build()
        );
        return Mono.empty();
    }
}
