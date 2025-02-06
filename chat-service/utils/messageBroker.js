const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const Chat = require('../models/chat.model')
module.exports.getUserDetails = async (userId) => {
    try {

        const connection = await amqp.connect(process.env.RABBIT_URL);
        const channel = await connection.createChannel();
        const queue = 'user_info_queue';
        const responseQueue = await channel.assertQueue('', {exclusive: true}); // file de reponse unique créer par la requête
        const correlationId = uuidv4(); // Générer un idetifiant de queue unique

        console.log(`[Chat Service] Demande d’infos pour userId: ${userId}, correlationId: ${correlationId}`);

        return new Promise((resolve, reject) => {
            // écoute la reponse
            channel.consume(responseQueue.queue, (msg) => {
                if (msg.properties.correlationId === correlationId) {
                    const userDetails = JSON.parse(msg.content.toString());
                    console.log(`[Post Service] Réponse reçue pour correlationId: ${correlationId}`);
                    resolve(userDetails);
                    channel.ack(msg);
                }

            }, { noAck: false });

            // Envoie la requête avec correlationId

            channel.sendToQueue(queue, Buffer.from(JSON.stringify({ userId })), {
                correlationId,
                replyTo: responseQueue.queue
            });

        })
    }
    catch(err){
        console.error(err);
    }
}


module.exports.consumeUserUpdate = async (userId) => {
    try {
        const conn = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await conn.createChannel();

        const exchange = 'user_update_exchange';
        await channel.assertExchange(exchange, 'fanout', { durable: false });

        const { queue } = await channel.assertQueue('', { exclusive: true });
        channel.bindQueue(queue, exchange, '');

        console.log('[Post Service] Attente des mises à jour utilisateur...');

        channel.consume(queue, async (msg) => {
            const updatedUser = JSON.parse(msg.content.toString());
            console.log(`[Post Service] Mise à jour reçue :`, updatedUser);

            // 🟢 Mettre à jour tous les posts de cet utilisateur
            await Chat.updateMany(
                { "users.posterId": updatedUser.userId }, // Trouver les documents où l'utilisateur est présent
                {
                    $set: {
                        "users.$[elem].username": updatedUser.name,
                        "users.$[elem].avatar": updatedUser.avatar
                    }
                },
                {
                    arrayFilters: [{ "elem.posterId": updatedUser.userId }] // Appliquer la modification uniquement à l'élément concerné
                }
            );


            console.log(`[Post Service] Posts mis à jour pour userId: ${updatedUser.userId}`);
        }, { noAck: true });

    }

    catch(err){
        console.error(err);
    }

}