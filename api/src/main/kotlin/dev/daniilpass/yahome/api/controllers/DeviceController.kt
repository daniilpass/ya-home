package dev.daniilpass.yahome.api.controllers

import dev.daniilpass.yahome.api.yaclient.entities.device.Device
import dev.daniilpass.yahome.api.yaclient.entities.device.DeviceAction
import dev.daniilpass.yahome.api.yaclient.model.DeviceActionResponse
import dev.daniilpass.yahome.api.yaservice.YaService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
class DeviceController {
    private val yaService = YaService()

    @GetMapping("/devices/{deviceId}")
    fun getDeviceInfo(
        @PathVariable deviceId: String
    ): Mono<Device> = yaService.getDeviceInfo(deviceId)

    @PostMapping("/devices/actions")
    fun postDeviceAction(
        @RequestBody deviceAction: DeviceAction
    ): Mono<DeviceActionResponse> = yaService.postDeviceAction(deviceAction)
}