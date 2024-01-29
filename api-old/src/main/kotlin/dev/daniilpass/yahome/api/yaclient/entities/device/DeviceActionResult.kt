package dev.daniilpass.yahome.api.yaclient.entities.device

import dev.daniilpass.yahome.api.yaclient.entities.Capability

data class DeviceActionResult (
    val id: String,
    val capabilities: List<Capability>
)