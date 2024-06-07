package com.anamensis.server.config;

import com.anamensis.server.entity.LogHistory;
import com.anamensis.server.service.LogHistoryService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpMethod;
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
        String path = exchange.getRequest().getPath().toString();
        HttpMethod method = exchange.getRequest().getMethod();
        String fileRegexp = "/api/files/\\S+";

        if(path.matches(fileRegexp)) {
            return chain.filter(exchange);
        }

        if(HttpMethod.GET.equals(method) || HttpMethod.DELETE.equals(method)) {
            return logWrite(new byte[0], exchange)
                    .subscribeOn(Schedulers.boundedElastic())
                    .then(chain.filter(exchange));
        }

        if(HttpMethod.PUT.equals(method) || HttpMethod.POST.equals(method) || HttpMethod.PATCH.equals(method)) {
            Flux<DataBuffer> body = exchange.getRequest().getBody().share();
            AtomicReference<byte[]> bodyByte = new AtomicReference<>();
            return DataBufferUtils.join(body)
                    .map(this::toBytes)
                    .doOnNext(bodyByte::set)
                    .publishOn(Schedulers.boundedElastic())
                    .flatMap(bytes -> logWrite(bytes, exchange))
                    .then(Mono.defer(() -> {
                        ServerWebExchange newExchange = newRequest(bodyByte.get(), exchange);
                        return chain.filter(newExchange);
                    }));
        }

        return chain.filter(exchange);
    }

    private byte[] toBytes (DataBuffer dataBuffer) {
        byte[] bytes = new byte[dataBuffer.readableByteCount()];
        dataBuffer.read(bytes);
        DataBufferUtils.release(dataBuffer);
        return bytes;
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
                .flatMap(logHistoryService::save)
                .onErrorMap(t -> new RuntimeException("로그 저장에 실패했습니다."))
                .then();

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

