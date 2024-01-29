package dev.daniilpass.yahome.api.yaclient.model

import dev.daniilpass.yahome.api.yaclient.entities.device.Device

data class HomeInfoResponse (
    val devices: List<Device>
)