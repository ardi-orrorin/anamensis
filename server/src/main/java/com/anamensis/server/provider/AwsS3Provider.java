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
import java.io.InputStream;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class AwsS3Provider {

    enum ThumbnailType {
        PROFILE,
        THUMBNAIL,
        ORI
    }
    private ThumbnailType thumbnailType;

    private final S3Client s3Client;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    private Thumbnails.Builder<? extends InputStream> builder;

    public Mono<Boolean> saveProfileThumbnail(FilePart filePart, String path, String filename, int width, int height) {
        return this.saveS3(filePart, path, filename, width, height, true, ThumbnailType.PROFILE);
    }

    public Mono<Boolean> saveThumbnail(FilePart filePart, String path, String filename, int width, int height) {
        return this.saveS3(filePart, path, filename, width, height, false, ThumbnailType.THUMBNAIL);
    }
    public Mono<Boolean> saveOri(FilePart filePart, String path, String filename) {
        return this.saveS3(filePart, path, filename, 0, 0, false, ThumbnailType.ORI);
    }

    private Mono<Boolean> saveS3(
        FilePart filePart,
        String path, String filename,
        int width, int height,
        boolean isCrop,
        ThumbnailType thumbnailType
    ) {

        PutObjectRequest.Builder reqBuilder = PutObjectRequest.builder()
                .bucket(bucket)
                .contentType(filePart.headers().getContentType().toString());

        PutObjectRequest req = reqBuilder.key(path.substring(1) + filename)
                .build();

        return DataBufferUtils.join(filePart.content())
                .flatMap(data -> {
                    if(width == 0 && height == 0) {
                        s3Client.putObject(req, RequestBody.fromInputStream(data.asInputStream(), data.readableByteCount()));
                        return Mono.just(true);
                    }


                    try(ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                        builder = Thumbnails.of(data.asInputStream())
                            .size(width, height)
                            .outputQuality(0.4);

                        if (isCrop) {
                            builder.crop(Positions.CENTER);
                        }

                        builder.toOutputStream(os);
                        s3Client.putObject(req, RequestBody.fromBytes(os.toByteArray()));

                    } catch (IOException e) {
                        return Mono.error(new RuntimeException(e));
                    }

                    return Mono.just(true);



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
