package dev.daniilpass.yahome.api.controllers

import dev.daniilpass.yahome.api.yaclient.entities.device.Device
import dev.daniilpass.yahome.api.yaclient.entities.device.DeviceAction
import dev.daniilpass.yahome.api.yaclient.model.DeviceActionResponse
import dev.daniilpass.yahome.api.yaservice.YaService
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class DeviceController {
    private val yaService = YaService()

    @GetMapping("/devices/{deviceId}")
    suspend fun getDeviceInfo(
        @PathVariable deviceId: String
    ): Device = yaService.getDeviceInfo(deviceId).awaitSingle()

    @PostMapping("/devices/actions")
    suspend fun postDeviceAction(
        @RequestBody deviceAction: DeviceAction
    ): DeviceActionResponse = yaService.postDeviceAction(deviceAction).awaitSingle()
}