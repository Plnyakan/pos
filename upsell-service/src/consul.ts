import consul from 'consul';

const consulClient = new consul({
    host: process.env.CONSUL_HOST || '127.0.0.1',
    port: process.env.CONSUL_PORT || '8500',
});

const serviceId = `upsell-service-${process.pid}`;

consulClient.agent.service.register({
    id: serviceId,
    name: 'upsell-service',
    address: 'upsell-service',
    port: 3003,
}, (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (err) throw err;
    console.log('Registered with Consul');
});

process.on('exit', () => {
    consulClient.agent.service.deregister(serviceId, (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (err) throw err;
        console.log('Deregistered from Consul');
    });
});
