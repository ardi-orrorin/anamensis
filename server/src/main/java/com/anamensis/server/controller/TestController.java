package com.anamensis.server.controller;

import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.io.BufferedReader;
import java.io.File;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/public/test")
public class TestController {

    @GetMapping(value = "test" , produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> get() {
        return Flux.create(sink -> {

            for(int i : IntStream.range(0, 200).toArray()){
                try {
                    Thread.sleep(30);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                sink.next("Hello " + i);
            }
            sink.complete();
        });
    }

    @GetMapping(value = "" , produces = "text/event-stream")
    public Flux<String> test() {

        return Flux.create(sink -> {
            try {
                Process p1 = new ProcessBuilder()
                    .directory(new File("./terraform"))
                    .command("sh", "apply.sh")
                    .start();


                try (BufferedReader s = new BufferedReader(new java.io.InputStreamReader(p1.getInputStream()))) {
                    String line;
                    while ((line = s.readLine()) != null) {
                        sink.next(line);
//                        sink.next(ServerSentEvent.<String>builder()
//                            .id(String.valueOf(System.currentTimeMillis()))
//                            .event("command-output")
//                            .data(line)
//                            .build()
//                        );
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                int exitCode = p1.waitFor();
//                sink.next(ServerSentEvent.<String>builder()
//                    .event("command-complete")
//                    .data("Command finished with exit code: " + exitCode)
//                    .build());
                sink.next("Command finished with exit code: " + exitCode);
                sink.complete();

            } catch (Exception e) {
                sink.error(e);
            }
        });
    }
}
