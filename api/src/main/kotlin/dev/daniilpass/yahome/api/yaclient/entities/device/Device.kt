package dev.daniilpass.yahome.api.yaclient.entities.device

import dev.daniilpass.yahome.api.yaclient.entities.Capability

data class Device(
    val id: String,
    val name: String,
    val type: String,
    val capabilities: List<Capability>,
)