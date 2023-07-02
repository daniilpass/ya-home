package dev.daniilpass.yahome.api.controllers

import dev.daniilpass.yahome.api.yaclient.model.HomeInfoResponse
import dev.daniilpass.yahome.api.yaservice.YaService
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HomeController {
    private val yaService = YaService()

    @GetMapping("/home/ping")
    fun ping(): String = "Pong"

    @GetMapping("/home/info")
    suspend fun info(): HomeInfoResponse = yaService.getHomeInfo().awaitSingle()
}