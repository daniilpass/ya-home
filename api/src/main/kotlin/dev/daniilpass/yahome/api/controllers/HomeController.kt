package dev.daniilpass.yahome.api.controllers

import dev.daniilpass.yahome.api.yaclient.model.HomeInfoResponse
import dev.daniilpass.yahome.api.yaservice.YaService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
class HomeController {
    private val yaService = YaService()

    @GetMapping("/home/ping")
    fun ping(): String = "Pong"

    @GetMapping("/home/info")
    fun info(): Mono<HomeInfoResponse> = yaService.getHomeInfo()
}