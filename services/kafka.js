const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

async function publishOrderEvent(eventType, payload) {
  await producer.connect();
  await producer.send({
    topic: 'order-events',
    messages: [
      {
        key: eventType,
        value: JSON.stringify(payload)
      }
    ]
  });
  await producer.disconnect();
}

module.exports = { publishOrderEvent };
