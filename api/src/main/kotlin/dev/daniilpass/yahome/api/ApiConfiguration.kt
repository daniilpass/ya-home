package dev.daniilpass.yahome.api

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(ApiConfigurationProperties::class)
class ApiConfiguration {

}

@ConfigurationProperties(prefix = "dev.daniilpass.yahome.api")
data class ApiConfigurationProperties (
    val baseUrl: String,
    val authToken: String,
    val cacheMaxSize: Long,
    val cacheTtl: Long,
)
