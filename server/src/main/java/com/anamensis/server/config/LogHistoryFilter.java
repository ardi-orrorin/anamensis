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

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicReference;


/**
 * 로그인 한 유저의 API 호출 로그 기록 필터
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LogHistoryFilter implements WebFilter {

    private final UserService userService;
    private final LogHistoryService logHistoryService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        AtomicReference<byte[]> bodyByte = new AtomicReference<>();

        Mono<ServerWebExchange> fileApi   = fileApi(exchange);
        Mono<ServerWebExchange> noBodyApi = noBodyApi(exchange);
        Mono<ServerWebExchange> bodyApi   = bodyApi(exchange, bodyByte);

        return Mono.zip(fileApi, noBodyApi, bodyApi)
                .flatMap(t ->
                    chain.filter(
                        bodyByte.get() != null
                        ? newRequest(bodyByte.get(), exchange)
                        : exchange
                    )
                );
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

    private Mono<ServerWebExchange> bodyApi(ServerWebExchange exchange, AtomicReference<byte[]> bodyByte) {
        if(this.isFileApi(exchange)) {
            return Mono.just(exchange);
        }

        HttpMethod method = exchange.getRequest().getMethod();

        if(!HttpMethod.PUT.equals(method) && !HttpMethod.POST.equals(method) && !HttpMethod.PATCH.equals(method)) {
            return Mono.just(exchange);
        }

        Flux<DataBuffer> body = exchange.getRequest().getBody();

        return DataBufferUtils.join(body)
                .map(this::toBytes)
                .doOnNext(bodyByte::set)
                .publishOn(Schedulers.boundedElastic())
                .flatMap(bytes -> logWrite(bytes, exchange))
                .map(ex -> newRequest(bodyByte.get(), ex));

    }

    private byte[] toBytes (DataBuffer dataBuffer) {
        byte[] bytes = new byte[dataBuffer.readableByteCount()];
        dataBuffer.read(bytes);
        DataBufferUtils.release(dataBuffer);
        return bytes;
    }

    private Mono<ServerWebExchange> logWrite(byte[] bytes, ServerWebExchange ex) {
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
                .flatMap(logHistoryService::save)
                .then(Mono.just(ex));
    }

    private ServerWebExchange newRequest(byte[] bytes, ServerWebExchange ex) {
        ServerHttpRequest request = new ServerHttpRequestDecorator(ex.getRequest()) {
            @Override
            public Flux<DataBuffer> getBody() {
                DataBufferFactory s = ex.getResponse().bufferFactory();
                return Flux.just(s.wrap(bytes));
            }
        };

        return ex.mutate().request(request).build();
    }
}

