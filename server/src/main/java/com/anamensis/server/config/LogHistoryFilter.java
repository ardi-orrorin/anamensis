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
        Mono<ServerWebExchange> ex = Mono.just(exchange)
            .share();

        Mono<Void> result = ex.flatMap(chain::filter);

        Mono<Tuple3<Boolean, Boolean, Boolean>> api = ex.flatMap(ex1 -> {
            Mono<Boolean> fileApi   = fileApi(ex1);
            Mono<Boolean> noBodyApi = noBodyApi(ex1);
            Mono<Boolean> bodyApi   = bodyApi(ex1);
            return Mono.zip(fileApi, noBodyApi, bodyApi);
        });

        return Mono.when(result, api);
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

    private Mono<Boolean> fileApi(ServerWebExchange exchange) {
        if(!this.isFileApi(exchange)) {
            return Mono.just(true);
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
                .then(Mono.just(true));
    }

    private Mono<Boolean> noBodyApi(ServerWebExchange exchange) {
        if(this.isFileApi(exchange)) {
            return Mono.just(true);
        }

        HttpMethod method = exchange.getRequest().getMethod();
        if(!HttpMethod.GET.equals(method) && !HttpMethod.DELETE.equals(method)) {
            return Mono.just(true);
        }

        return logWrite(new byte[0], exchange)
                .subscribeOn(Schedulers.boundedElastic())
                .then(Mono.just(true));
    }

    private Mono<Boolean> bodyApi(ServerWebExchange exchange) {
        if(this.isFileApi(exchange)) {
            return Mono.just(true);
        }

        HttpMethod method = exchange.getRequest().getMethod();

        if(!HttpMethod.PUT.equals(method) && !HttpMethod.POST.equals(method) && !HttpMethod.PATCH.equals(method)) {
            return Mono.just(true);
        }

        return Mono.just(exchange)
            .share()
            .publishOn(Schedulers.boundedElastic())
            .doOnNext(ex -> {
                DataBufferUtils.join(ex.getRequest().getBody())
                    .map(this::toBytes)
                    .flatMap(bytes -> logWrite(bytes, exchange))
                    .subscribe();
            })
            .flatMap(ex -> Mono.just(true));
    }

    private byte[] toBytes (DataBuffer dataBuffer) {
        byte[] bytes = new byte[dataBuffer.readableByteCount()];
        dataBuffer.read(bytes);
        DataBufferUtils.release(dataBuffer);
        return bytes;
    }

    private Mono<Boolean> logWrite(byte[] bytes, ServerWebExchange ex) {
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
                .flatMap($ -> Mono.just(true));
    }
}

