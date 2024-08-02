package com.anamensis.server.config;

import com.anamensis.server.entity.LogHistory;
import com.anamensis.server.service.LogHistoryService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuple3;
import reactor.util.function.Tuples;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicReference;


/**
 * 로그인 한 유저의 API 호출 로그 기록 필터
 */
@Component
@RequiredArgsConstructor
public class LogHistoryFilter implements WebFilter {

    private final UserService userService;
    private final LogHistoryService logHistoryService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {

        AtomicReference<byte[]> body = new AtomicReference<>();
        Mono<ServerWebExchange> fileApi   = fileApi(exchange)
                .subscribeOn(Schedulers.boundedElastic());
        Mono<ServerWebExchange> noBodyApi = noBodyApi(exchange)
            .subscribeOn(Schedulers.boundedElastic());
        Mono<ServerWebExchange> bodyApi   = bodyApi(exchange, body)
            .subscribeOn(Schedulers.boundedElastic());

        return Mono.zip(fileApi, noBodyApi, bodyApi)
                .flatMap(t -> {
                    if(body.get() == null) return chain.filter(exchange);

                    return chain.filter(replaceBody(t.getT3(), body.get()));
                });
    }

    private boolean isFileApi(ServerWebExchange ex) {
        String fileRegexp = "/api/files/\\S+";
        String publicFileRegexp = "/public" + fileRegexp;
        String path = ex.getRequest().getPath().toString();
        HttpHeaders headers = ex.getRequest().getHeaders();
        boolean isEventStream =  headers.getAccept().contains(MediaType.TEXT_EVENT_STREAM);

        return  !isEventStream
                && (path.matches(fileRegexp) || path.matches(publicFileRegexp))
                && (headers.getContentType() != null && headers.getContentType().getType().contains("multipart"));
    }

    private Mono<ServerWebExchange> fileApi(ServerWebExchange exchange) {
        if(!this.isFileApi(exchange)) {
            return Mono.just(exchange);
        }

        return exchange.getMultipartData()
                .flatMap(data -> {
                    byte[] file = data.getFirst("file")
                            .headers().getContentDisposition()
                            .getFilename().getBytes();
                    return logWrite(file, exchange);
                })
                .subscribeOn(Schedulers.boundedElastic())
                .onErrorResume(e -> {
                    logWrite("upload File".getBytes(), exchange)
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe();
                    return Mono.empty();
                })
                .then(Mono.just(exchange));
    }

    private Mono<ServerWebExchange> noBodyApi(ServerWebExchange exchange) {
        if(this.isFileApi(exchange)) {
            return Mono.just(exchange);
        }

        HttpMethod method = exchange.getRequest().getMethod();
        if(!HttpMethod.GET.equals(method) && !HttpMethod.DELETE.equals(method)) {
            return Mono.just(exchange);
        }

        return logWrite(new byte[0], exchange)
                .subscribeOn(Schedulers.boundedElastic())
                .then(Mono.just(exchange));
    }

    private Mono<ServerWebExchange> bodyApi(ServerWebExchange exchange, AtomicReference<byte[]> body) {
        if(this.isFileApi(exchange)) {
            return Mono.just(exchange);
        }

        HttpMethod method = exchange.getRequest().getMethod();

        if(!HttpMethod.PUT.equals(method) && !HttpMethod.POST.equals(method) && !HttpMethod.PATCH.equals(method)) {
            return Mono.just(exchange);
        }

        return Mono.just(exchange)
            .publishOn(Schedulers.boundedElastic())
            .flatMap(ex ->
                DataBufferUtils.join(ex.getRequest().getBody())
                    .map(this::toBytes)
                    .doOnNext(body::set)
                    .flatMap(bytes -> logWrite(bytes, exchange))
            )
            .then(Mono.just(exchange));

    }

    private byte[] toBytes (DataBuffer dataBuffer) {
        byte[] bytes = new byte[dataBuffer.readableByteCount()];
        dataBuffer.read(bytes);
        DataBufferUtils.release(dataBuffer);
        return bytes;
    }

    private ServerWebExchange replaceBody(ServerWebExchange exchange, byte[] bytes) {
        ServerHttpRequest request = new ServerHttpRequestDecorator(exchange.getRequest()) {
            @Override
            public Flux<DataBuffer> getBody() {
                DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
                return Flux.just(buffer);
            }
        };

        return exchange.mutate().request(request).build();
    }

    private Mono<Void> logWrite(byte[] bytes, ServerWebExchange ex) {
        String path = ex.getRequest().getPath().toString();
        String body = new String(bytes, StandardCharsets.UTF_8);
        String header = ex.getRequest().getHeaders().toString();
        String method = ex.getRequest().getMethod().toString();
        String localAddr = ex.getRequest().getLocalAddress().toString();
        String remoteAddr = ex.getRequest().getRemoteAddress().toString();
        String query = ex.getRequest().getQueryParams().toString();
        String URI = ex.getRequest().getURI().toString();


        return ex.getPrincipal()
                .flatMap(principal -> userService.findUserByUserId(principal.getName()))
                .zipWith(ex.getSession())
                .map(t ->
                    LogHistory.builder()
                            .memberPk(t.getT1().getId())
                            .method(method)
                            .path(path)
                            .uri(URI)
                            .body(body)
                            .query(query)
                            .localAddress(localAddr)
                            .headers(header)
                            .remoteAddress(remoteAddr)
                            .session(t.getT2().getId())
                            .createAt(LocalDateTime.now())
                            .build()
                )
                .flatMap(logHistoryService::save);
    }
}

