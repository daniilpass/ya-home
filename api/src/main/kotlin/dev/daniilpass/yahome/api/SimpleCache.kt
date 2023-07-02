package dev.daniilpass.yahome.api

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import reactor.core.publisher.Mono
import java.time.Duration

class SimpleCache(
    maxSize: Long,
    ttl: Duration
) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)
    private val cache: Cache<String, Any> =
        Caffeine.newBuilder()
            .maximumSize(maxSize)
            .expireAfterWrite(ttl)
            .build()

    fun <T> get(key: String, getValue: () -> Mono<T>): Mono<T> {
        val cacheValue: T? = cache.getIfPresent(key) as T?

        return if (cacheValue != null) {
            logger.info("FOUND IN CACHE $key")
            Mono.just(cacheValue)
        } else {
            getValue().doOnNext { result ->
                cache.put(key, result)
            }
        }
    }
}