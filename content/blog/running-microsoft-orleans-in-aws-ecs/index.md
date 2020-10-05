---
title: Running Microsoft Orleans in AWS ECS
date: '2020-10-05T03:56:06.098Z'
description:
---

[Microsoft Orleans](https://dotnet.github.io/orleans/) is a great framework for building distributed systems. It runs many little silos that do their bit of work. In order to work as a one system, they need to talk to each other. Unfortunately, there is no documentation on how to deploy it into [AWS ECS](https://aws.amazon.com/ecs/) and one will most likely face some networking issues.

In a dynamic environment, like [AWS ECS](https://aws.amazon.com/ecs/), containers scale up and down all the time to achieve optimal resource utilisation or to respond to the load, e.g. number of messages in the processing queue. Each [Microsoft Orleans](https://dotnet.github.io/orleans/) silo registers itself in a directory during the startup stage, normally it’s a database. This is how they know how to discover each other. But how is it possible to find out the host's IP address and port, when we don’t even know the container instance which will host the task?

[AWS](https://aws.amazon.com/) provides multiple HTTP endpoints that allow us to get useful information at runtime. The port information can be read from the [Amazon ECS Task metadata endpoint version 4](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v4.html). It returns JSON data, including the port mappings we are after. The container instance IP address can be obtained by calling the following [instance metadata](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) endpoint: `http://169.254.169.254/latest/meta-data/local-ipv4`. Now, there are no [AWS SDK](https://aws.amazon.com/sdk-for-net/) classes, which provide this functionality out of the box. I’ve created a handy [NuGet package](https://www.nuget.org/packages/AWSECS.ContainerMetadata/) that does what we need.

1. Add the [AWSECS.ContainerMetadata NuGet package](https://www.nuget.org/packages/AWSECS.ContainerMetadata/) to the project:

```bash
dotnet add package AWSECS.ContainerMetadata
```

2. Add the AWS Container Metadata Service to the DI container:

```csharp
services.AddAWSContainerMetadataService();
```

3. Finally, get the information we are looking for and configure the [Microsoft Orleans’](https://dotnet.github.io/orleans/) endpoint options (assuming we exposed the default ports from within the container):

```csharp
.Configure<EndpointOptions>(options =>
{
    var awsContainerMetadata = _awsContainerMetadata.GetContainerMetadata();
    var siloPort = awsContainerMetadata?.Ports?.FirstOrDefault(p => p.ContainerPort == EndpointOptions.DEFAULT_SILO_PORT)?.HostPort ?? EndpointOptions.DEFAULT_SILO_PORT;
    var gatewayPort = awsContainerMetadata?.Ports?.FirstOrDefault(p => p.ContainerPort == EndpointOptions.DEFAULT_GATEWAY_PORT)?.HostPort ?? EndpointOptions.DEFAULT_GATEWAY_PORT;
    var advertisedIPAddress = _awsContainerMetadata.GetHostPrivateIPv4Address() ?? Dns.GetHostAddresses(Dns.GetHostName()).First();

    options.AdvertisedIPAddress = advertisedIPAddress;
    options.SiloPort = siloPort;
    options.GatewayPort = gatewayPort;
    options.GatewayListeningEndpoint = new IPEndPoint(IPAddress.Any, EndpointOptions.DEFAULT_GATEWAY_PORT);
    options.SiloListeningEndpoint = new IPEndPoint(IPAddress.Any, EndpointOptions.DEFAULT_SILO_PORT);
})
```

\
It’s as simple as that. If you want to take a look at the source code, it’s hosted [here](https://github.com/eyamenko/AWSECS.ContainerMetadata). If you find an issue or just want to make it better, please don’t hesitate to create a pull request. Happy coding!
