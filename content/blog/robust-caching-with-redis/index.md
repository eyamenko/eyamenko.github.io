---
title: Robust caching with Redis
date: '2019-12-25T02:55:56.981Z'
description: Sometimes querying the database can be slow. Especially, if the tables are large and it’s not possible to take advantage of existing indices. That’s where caching shines. It’s a lot faster to get a value from cache instead of getting it from the database. Particularly, if it’s a frequently returned data and it doesn’t change often...
---

Sometimes querying the database can be slow. Especially, if the tables are large and it’s not possible to take advantage of existing indices. That’s where caching shines. It’s a lot faster to get a value from cache instead of getting it from the database. Particularly, if it’s a frequently returned data and it doesn’t change often.

One of the great solutions for caching is [Redis](https://redis.io/). Redis is an in-memory data store. There are client libraries for all main platforms. Redis is widely used and it’s supported by all major cloud providers (AWS, Azure, etc.).

Unfortunately, incorrectly used or incorrectly configured client can bring the entire service down. Let’s take a look at some good practices, which can help to speed up our services and don’t kill them under the load.

As an example, I will use an excellent client library for .NET, called [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/). At the time of writing, it’s the most popular one and it’s battle tested by some large websites, e.g. [StackOverflow](https://stackoverflow.com/).

1. First things first, make sure to use the latest version of the library. Authors update it and release bug fixes frequently.

2. Have a single connection per application and initialize it in a thread-safe way. Make the cache client a singleton.

In the constructor:

```csharp
_connection = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect(redisOptions.Value.Configuration));
```

\
In the `Startup.cs`:

```csharp
services.AddSingleton<ICacheClient, RedisCacheClient>();
```

3. Use circuit breakers. Wrap get and set commands into a separate circuit breakers. Sometimes new items cannot be inserted, because the server, for instance, ran out of memory, but it shouldn't affect the ability to get cached items.

In the constructor:

```csharp
_readCircuitBreaker = Policy.Handle<Exception>().CircuitBreakerAsync(exceptionsAllowedBeforeBreaking, durationOfBreak);
_writeCircuitBreaker = Policy.Handle<Exception>().CircuitBreakerAsync(exceptionsAllowedBeforeBreaking, durationOfBreak);
```

4. If there is no need, don’t wait for a response when setting values. Just fire and forget set commands.

```csharp
keyValuePairs.Select(kvp => db.StringSetAsync(kvp.Key, kvp.Value, expiry: _cacheExpiry, flags: CommandFlags.FireAndForget));
```

5. Set the minimum number of worker threads used by the application. You can read more about it [here](https://github.com/StackExchange/StackExchange.Redis/blob/master/docs/Timeouts.md).

In the `Program.cs`:

```csharp
ThreadPool.SetMinThreads(MinThreads, MinThreads);
```

6. Configure the client to not abort if connection fails. Also, configure sync and connection timeouts.

```
localhost:6379,abortConnect=false,syncTimeout=3000,connectTimeout=3000
```

\
Happy coding!
