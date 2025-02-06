const amqp = require('amqplib');
const Users = require('../model/user.model');
const {v4: uuidv4} = require('uuid')

module.exports.consumeUserInfoRequests = async ()=> {
    try {

        const connection = await amqp.connect(process.env.RABBIT_URL);
        const channel = await connection.createChannel();

        const queue = 'user_info_queue';
        await channel.assertQueue(queue, {durable: false});

        console.log('[Auth Service] Attente des requêtes d’infos utilisateur...');

        channel.consume(queue, async (msg) => {
            const {userId } = JSON.parse(msg.content.toString());
            console.log(`[Auth Service] Requête reçue pour userId: ${userId}, correlationId: ${msg.properties.correlationId}`);

            try {
                const user = await Users.findById(userId).select("name avatar ");
                const response = JSON.stringify(user || {});

                // Envoi de la réponse à la file indiquée dans `replyTo`
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
                    correlationId: msg.properties.correlationId,
                });
            }
            catch (error) {
                console.error('[Auth Service] Erreur récupération utilisateur:', error);
                channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({})), {
                    correlationId: msg.properties.correlationId
                });
            }
            channel.ack(msg);
        });

    }
    catch (err) {
        console.error(err);
    }
}

module.exports.publishUserUpdate = async (user)=> {

    try {
        const conn = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await conn.createChannel();

        const exchange = 'user_update_exchange';
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        const message = JSON.stringify({
            userId: user._id,
            name: user.name,
           avatar: user.avatar
        });

        channel.publish(exchange, '', Buffer.from(message));
        console.log(`[User Service] Mise à jour publiée :`, message);

        setTimeout(() => {
            conn.close();
        }, 500);
    }
    catch (err){
        console.error(err);
    }

}