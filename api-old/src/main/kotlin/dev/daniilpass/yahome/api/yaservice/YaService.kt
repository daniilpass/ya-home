package dev.daniilpass.yahome.api.yaservice

import dev.daniilpass.yahome.api.ApiConfigurationProperties
import dev.daniilpass.yahome.api.SimpleCache
import dev.daniilpass.yahome.api.yaclient.YaClient
import dev.daniilpass.yahome.api.yaclient.entities.device.Device
import dev.daniilpass.yahome.api.yaclient.entities.device.DeviceAction
import dev.daniilpass.yahome.api.yaclient.model.DeviceActionResponse
import dev.daniilpass.yahome.api.yaclient.model.HomeInfoResponse
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.time.Duration

@Service
class YaService(
    properties: ApiConfigurationProperties
) {
    private val yaClient = YaClient(properties.baseUrl, properties.authToken)
    private val cache = SimpleCache(properties.cacheMaxSize, Duration.ofMillis(properties.cacheTtl))

    suspend fun getHomeInfo(): Mono<HomeInfoResponse> {
        return cache.get("getHomeInfo") {
            yaClient.getHomeInfo()
        }
    }

    suspend fun getDeviceInfo(deviceId: String): Mono<Device> {
        return cache.get("getDeviceInfo:$deviceId") {
            yaClient.getDeviceInfo(deviceId)
        }
    }

    fun postDeviceAction(deviceAction: DeviceAction): Mono<DeviceActionResponse> =
        yaClient.postDeviceAction(deviceAction)
}