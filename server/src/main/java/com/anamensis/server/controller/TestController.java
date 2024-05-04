package com.anamensis.server.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;

@RestController
@RequestMapping("api/test")
@Slf4j
public class TestController {

    Sinks.Many<HashRecord> list = Sinks.many().multicast().directAllOrNothing();

    private record HashRecord(
        String hash,
        String message
    ) {}

    @PublicAPI
    @GetMapping(value = "{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<HashRecord> test(@PathVariable String id) {

        return list.asFlux()
                .publishOn(Schedulers.boundedElastic())
                .onBackpressureBuffer()
                .filter(record -> record.hash.equals(id));
    }

    @PublicAPI
    @GetMapping("push")
    public Mono<String> push() {
        return Mono.just("success")
                    .publishOn(Schedulers.boundedElastic())
                    .doOnNext($ -> {
                       Flux.just(new HashRecord("1", "test11212"))
                           .repeat(10)
                           .delayElements(Duration.ofSeconds(1))
                           .doOnNext(list::tryEmitNext)
                           .subscribe();

                       Flux.just(new HashRecord("2", "test11212"))
                               .repeat(10)
                               .delayElements(Duration.ofSeconds(1))
                               .doOnNext(list::tryEmitNext)
                               .subscribe();
                    });

    }
}
