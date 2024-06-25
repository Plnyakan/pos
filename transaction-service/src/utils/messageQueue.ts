import amqplib from 'amqplib';

const sendToQueue = async (queue: string, message: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const connection = await amqplib.connect(`amqp://${process.env.RABBITMQ_HOST}`);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    await channel.close();
    await connection.close();
};

const receiveFromQueue = async (queue: string, handleMessage: (msg: any) => void) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const connection = await amqplib.connect(`amqp://${process.env.RABBITMQ_HOST}`);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    channel.consume(queue, (msg) => {
        if (msg !== null) {
            const messageContent = JSON.parse(msg.content.toString());
            handleMessage(messageContent);
            channel.ack(msg);
        }
    });
};

export { sendToQueue , receiveFromQueue};
