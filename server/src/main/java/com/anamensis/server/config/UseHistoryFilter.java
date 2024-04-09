package com.anamensis.server.config;

import com.anamensis.server.entity.LogHistory;
import com.anamensis.server.service.LogHistoryService;
import com.anamensis.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class UseHistoryFilter implements WebFilter {


    private final UserService userService;
    private final LogHistoryService logHistoryService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        String method = exchange.getRequest().getMethod().toString();


        if(path.equals("/user/login") || path.equals("/user/signup")) {
            return chain.filter(exchange);
        }

        if(method.equals("GET") || method.equals("DELETE")) {
            return Mono.zip(Mono.just(exchange), exchange.getPrincipal(), exchange.getSession())
                    .doOnNext(t -> logWrite(new byte[0], t.getT1(),(Principal) t.getT2(), t.getT3()))
                    .map(t -> t.getT1())
                    .flatMap(chain::filter);
        }

        if(method.equals("PUT") || method.equals("POST")) {
            Flux<DataBuffer> body = exchange.getRequest().getBody();

            return Mono.zip(DataBufferUtils.join(body), exchange.getPrincipal(), exchange.getSession())
                    .map(t -> t.mapT1(this::toBytes))
                    .doOnNext(t -> logWrite(t.getT1(), exchange, (Principal) t.getT2(), t.getT3()))
                    .map(t -> CompleteFilter(t.getT1(), exchange))
                    .flatMap(chain::filter);
        }

        return chain.filter(exchange);
    }

    private void finally1 (ServerWebExchange ex) {
        ex.getPrincipal().subscribe(principal -> {
            UserDetails userDetails = (UserDetails) principal;
            log.info("User: {}", userDetails.getUsername());
        });
        log.info("Finally");
    };

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

        logHistoryService.save(logHistory);
    }

    private ServerWebExchange CompleteFilter(byte[] bytes, ServerWebExchange ex) {
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

