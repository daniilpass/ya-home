package dev.daniilpass.yahome.api.yaclient

import dev.daniilpass.yahome.api.yaclient.entities.device.Device
import dev.daniilpass.yahome.api.yaclient.entities.device.DeviceAction
import dev.daniilpass.yahome.api.yaclient.model.DeviceActionResponse
import dev.daniilpass.yahome.api.yaclient.model.HomeInfoResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono



class YaClient {
    private val httpClient: WebClient

    init {
        httpClient = WebClient
                .builder()
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer $TOKEN")
                .build()
    }

    fun getHomeInfo(): Mono<HomeInfoResponse> {
        return httpClient
                .get()
                .uri("/user/info")
                .retrieve()
                .bodyToMono(HomeInfoResponse::class.java)
    }

    fun getDeviceInfo(deviceId: String): Mono<Device> {
        return httpClient
                .get()
                .uri("/devices/$deviceId")
                .retrieve()
                .bodyToMono(Device::class.java)
    }

    fun postDeviceAction(deviceAction: DeviceAction): Mono<DeviceActionResponse> {
        return httpClient
                .post()
                .uri("/devices/actions")
                .body(BodyInserters.fromValue(deviceAction))
                .retrieve()
                .bodyToMono(DeviceActionResponse::class.java)
    }
}