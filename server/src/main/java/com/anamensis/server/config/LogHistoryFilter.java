package com.anamensis.server.config;

import com.anamensis.server.entity.LogHistory;
import com.anamensis.server.service.LogHistoryService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
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
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;

import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;


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
        String actuatorRegexp = "/actuator/\\S+";
        String publicRegexp = "/public/\\S+";

        // /user/histories는 제외한 모든 /user/** 경로에 대해 로그를 남김
        if((path.matches(publicRegexp) || path.matches(actuatorRegexp))) {
            return chain.filter(exchange);
        }

        //--------------------------------------------------------------------------------
        // 밑의 로직이 실행 되기 위해서는 Spring Security에서 유저가 인가되어야만 사용 가능
        //--------------------------------------------------------------------------------

        // RequestBody의 사용 기준으로 분기 처리 (DataBuffer를 byte[]로 변환)
        // getBody의 DataBuffer를 byte[]로 변환하여 로그에 기록하는데,
        // 이 때 DataBuffer를 release하지 않으면 메모리 누수가 발생할 수 있음

        // GET, DELETE는 body가 없이 로그 기록
        if(HttpMethod.GET.equals(method) || HttpMethod.DELETE.equals(method)) {
            return Mono.zip(Mono.just(exchange), exchange.getPrincipal(), exchange.getSession())
                    .doOnNext(t -> logWrite(new byte[0], t.getT1(),(Principal) t.getT2(), t.getT3()))
                    .publishOn(Schedulers.boundedElastic())
                    .map(Tuple2::getT1)
                    .flatMap(chain::filter);
        }

        // PUT, POST, PATCH는 body가 있을 때 로그 기록
        // body를 byte[]로 변환하여, String 형태로 변환하여 로그에 기록
        if(HttpMethod.PUT.equals(method) || HttpMethod.POST.equals(method) || HttpMethod.PATCH.equals(method)) {
            Flux<DataBuffer> body = exchange.getRequest().getBody();

            return Mono.zip(DataBufferUtils.join(body), exchange.getPrincipal(), exchange.getSession())
                    .map(t -> t.mapT1(this::toBytes)) // DataBuffer -> byte[]
                    .doOnNext(t -> logWrite(t.getT1(), exchange, (Principal) t.getT2(), t.getT3()))
                    .publishOn(Schedulers.boundedElastic())
                    .map(t -> newRequest(t.getT1(), exchange))
                    // DataBuffer에서 기록을 위해 byte[]로 변환하여 이벤트를 사용 했으므로,
                    // 다시 byte[]를 DataBuffer로 변환하여 다음 필터를 진행하도록 함
                    .flatMap(chain::filter);
        }

        return chain.filter(exchange);
    }

    private byte[] toBytes (DataBuffer dataBuffer) {
        byte[] bytes = new byte[dataBuffer.readableByteCount()];
        dataBuffer.read(bytes);
        DataBufferUtils.release(dataBuffer);
        return bytes;
    }

    private void logWrite(byte[] bytes, ServerWebExchange ex, Principal principal, WebSession session) {
        String path = ex.getRequest().getPath().toString();
        String body = new String(bytes, StandardCharsets.UTF_8);
        String header = ex.getRequest().getHeaders().toString();
        String method = ex.getRequest().getMethod().toString();
        String localAddr = ex.getRequest().getLocalAddress().toString();
        String remoteAddr = ex.getRequest().getRemoteAddress().toString();
        String query = ex.getRequest().getQueryParams().toString();
        String URI = ex.getRequest().getURI().toString();
        String user = principal.getName();
        String sessionId = session.getId();
        long userPK = userService.findUserByUserId(user).getId();

        LogHistory logHistory = LogHistory.builder()
                .userPk(userPK)
                .method(method)
                .path(path)
                .uri(URI)
                .body(body)
                .query(query)
                .localAddress(localAddr)
                .headers(header)
                .remoteAddress(remoteAddr)
                .session(sessionId)
                .createAt(LocalDateTime.now())
                .build();

        Mono.just(logHistory)
                .subscribeOn(Schedulers.boundedElastic())
                .doOnNext(logHistoryService::save)
                .subscribe();
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

