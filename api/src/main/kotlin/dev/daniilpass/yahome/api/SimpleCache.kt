package dev.daniilpass.yahome.api

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import reactor.core.publisher.Mono
import java.time.Duration

class SimpleCache(
    maxSize: Long,
    ttl: Duration
) {
    private val cacheMutex = Mutex()
    private val cache: Cache<String, Any> =
        Caffeine.newBuilder()
            .maximumSize(maxSize)
            .expireAfterWrite(ttl)
            .build()

    suspend fun <T: Any> get(key: String, getValue: () -> Mono<T>): Mono<T> {
        // Try to get value from cache
        var cacheValue: T? = cache.getIfPresent(key) as? T
        if (cacheValue != null) {
            return Mono.just(cacheValue)
        }

        // Lock, double check cache, otherwise get
        return cacheMutex.withLock {
            cacheValue = cache.getIfPresent(key) as? T
            if (cacheValue != null) {
                Mono.just(cacheValue!!)
            } else {
                Mono.just(getValue().awaitSingle().also {result ->
                    cache.put(key, result)
                })
            }
        }
    }
}