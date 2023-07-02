package dev.daniilpass.yahome.api.yaservice

import dev.daniilpass.yahome.api.SimpleCache
import dev.daniilpass.yahome.api.yaclient.YaClient
import dev.daniilpass.yahome.api.yaclient.entities.device.Device
import dev.daniilpass.yahome.api.yaclient.entities.device.DeviceAction
import dev.daniilpass.yahome.api.yaclient.model.DeviceActionResponse
import dev.daniilpass.yahome.api.yaclient.model.HomeInfoResponse
import reactor.core.publisher.Mono
import java.time.Duration

class YaService {
    private val yaClient = YaClient()
    private val cache = SimpleCache(maxSize = 100L, ttl = Duration.ofMillis(1000))

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