package com.anamensis.server.provider;

import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@Component
@RequiredArgsConstructor
public class AwsS3Provider {

    private final S3Client s3Client;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    public Mono<Void> saveProfileThumbnail(FilePart filePart, String path, String filename, int width, int height) {
        return this.saveS3(filePart, path, filename, width, height, true);
    }

    public Mono<Void> saveThumbnail(FilePart filePart, String path, String filename, int width, int height) {
        return this.saveS3(filePart, path, filename, width, height, false);
    }
    public Mono<Void> saveOri(FilePart filePart, String path, String filename) {
        return this.saveS3(filePart, path, filename, 0, 0, false);
    }

    private Mono<Void> saveS3(FilePart filePart, String path, String filename, int width, int height, boolean isCrop) {
        PutObjectRequest.Builder reqBuilder = PutObjectRequest.builder()
                .bucket(bucket)
                .contentType(filePart.headers().getContentType().toString());

        PutObjectRequest req = reqBuilder.key(path.substring(1) + filename)
                .build();

        return DataBufferUtils.join(filePart.content())
                .publishOn(Schedulers.boundedElastic())
                .flatMap(data -> {
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

                    try {
                        if (width == 0 || height == 0) {
                            data.asInputStream().transferTo(outputStream);
                        } else {
                            Thumbnails.Builder<? extends InputStream> builder = Thumbnails.of(data.asInputStream())
                                    .size(width, height)
                                    .outputQuality(0.4);

                            if (isCrop) {
                                builder.crop(Positions.CENTER);
                            }

                            builder.toOutputStream(outputStream);
                        }
                    } catch (Exception e) {
                        return Mono.error(new RuntimeException(e));
                    }

                    s3Client.putObject(req, RequestBody.fromBytes(outputStream.toByteArray()));

                    return Mono.empty();
                });
    }

    public Mono<Void> deleteS3(String filePath, String filename) {
        s3Client.deleteObject(
                DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(filePath.substring(1) + filename)
                        .build()
        );
        return Mono.empty();
    }
}
