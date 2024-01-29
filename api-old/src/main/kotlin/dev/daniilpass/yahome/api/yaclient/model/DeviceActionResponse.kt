package dev.daniilpass.yahome.api.yaclient.model

import dev.daniilpass.yahome.api.yaclient.entities.device.DeviceActionResult

data class DeviceActionResponse (
    val devices: List<DeviceActionResult>
)