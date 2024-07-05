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
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class AwsS3Provider {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    private final S3Client s3Client;

    private enum ThumbnailType { PROFILE, CONTENT_THUMBNAIL, ALTTUEL_THUMBNAIL, ALBUM_THUMBNAIL, ORI }

    private final String CACHE_CONTROL = "public, max-age=" + (60 * 60 * 24 * 365);

    private static final float PROFILE = 0.4f;
    private static final float CONTENT_THUMBNAIL = 0.6f;
    private static final float ALTTUEL_THUMBNAIL = 0.4f;

    private static final float ALBUM_THUMBNAIL = 0.7f;

    private static final ThumbnailType[] CROP_LIST = {
        ThumbnailType.PROFILE,
        ThumbnailType.ALTTUEL_THUMBNAIL,
        ThumbnailType.ALBUM_THUMBNAIL
    };

    private Mono<Boolean> saveS3(
        FilePart filePart,
        String path, String filename,
        int width, int height,
        ThumbnailType thumbnailType
    ) {

        PutObjectRequest.Builder reqBuilder = PutObjectRequest.builder()
                .bucket(bucket)
                .contentType(filePart.headers().getContentType().toString())
                .cacheControl(CACHE_CONTROL);


        PutObjectRequest req = reqBuilder.key(path.substring(1) + filename)
                .build();

        return DataBufferUtils.join(filePart.content())
                .flatMap(data -> {
                    if(thumbnailType == ThumbnailType.ORI) {
                        s3Client.putObject(req, RequestBody.fromInputStream(data.asInputStream(), data.readableByteCount()));
                        return Mono.just(true);
                    }

                    try(ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                        buildThumbnail(data.asInputStream(), width, height, thumbnailType)
                            .toOutputStream(os);

                        s3Client.putObject(req, RequestBody.fromBytes(os.toByteArray()));

                    } catch (IOException e) {
                        return Mono.error(new RuntimeException(e));
                    }

                    return Mono.just(true);
                });
    }

    private Thumbnails.Builder<? extends InputStream> buildThumbnail(
        InputStream is, int width, int height, ThumbnailType thumbnailType
    ) {
        Thumbnails.Builder<? extends InputStream> builder = Thumbnails.of(is).size(width, height);

        switch (thumbnailType) {
            case PROFILE -> builder.outputQuality(PROFILE);
            case CONTENT_THUMBNAIL -> builder.outputQuality(CONTENT_THUMBNAIL);
            case ALTTUEL_THUMBNAIL -> builder.outputQuality(ALTTUEL_THUMBNAIL);
            case ALBUM_THUMBNAIL -> builder.outputQuality(ALBUM_THUMBNAIL);
        }

        if(Arrays.stream(CROP_LIST).anyMatch(crop -> crop == thumbnailType))
            builder.crop(Positions.CENTER);

        return builder;
    }

    public Mono<Boolean> saveProfileThumbnail(FilePart filePart, String path, String filename) {
        return this.saveS3(filePart, path, filename, 150, 150, ThumbnailType.PROFILE);
    }

    public Mono<Boolean> saveThumbnail(FilePart filePart, String path, String filename) {
        return this.saveS3(filePart, path, filename, 700, 700,ThumbnailType.CONTENT_THUMBNAIL);
    }
    public Mono<Boolean> saveOriginal(FilePart filePart, String path, String filename) {
        return this.saveS3(filePart, path, filename, 0, 0, ThumbnailType.ORI);
    }

    public Mono<Boolean> saveAlttuelThumbnail(FilePart filePart, String path, String filename) {
        return this.saveS3(filePart, path, filename, 300, 300, ThumbnailType.ALTTUEL_THUMBNAIL);
    }

    public Mono<Boolean> saveAlbumThumbnail(FilePart filePart, String path, String filename) {
        return this.saveS3(filePart, path, filename, 500, 500, ThumbnailType.ALBUM_THUMBNAIL);
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

    public void aws3ImgDelete(String filePath, String fileName) {
        String thumbnail = fileName.substring(0, fileName.lastIndexOf("."))
            + "_thumb"
            + fileName.substring(fileName.lastIndexOf("."));

        this.deleteS3(filePath, fileName)
            .subscribe();

        this.deleteS3(filePath, thumbnail)
            .subscribe();
    }


}
