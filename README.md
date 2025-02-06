<h2>Comment lancer le project</h2>
<h3> Logiciels à installer</h3>

* Télegarger en installer node.js <br>
Cliquer le lien suivant pour voir la documetation : https://nodejs.org/en/download
* Télécharger et installer RabbiMQ <br>
Cliquer le lien suivant pour voir la documetation : https://www.rabbitmq.com/docs/download

<h3> Lancement du projet </h3>

* Se placer à la racine de chaque projet et taper la commande <i>npm install<i> 
<p> </p>

* Dans <b>authentification-service</b> dans "/config' créer un fichier ".env" et y ajouter les variables suivantes:
    *   PORT : port d'ecoute du service 
    *  MONGO_URL : url vers la base de donnée MongoDB
    *  RABBIT_URL: url vers le cluster RabbitMQ "amqp://localhost" s'il est installer sur votre PC en local
    * TOKEN_SECRET : secret pour le token d'authenfication
  <p> </p>
* Dans <b>post-service</b> et <b>chat-service</b> dans "/config' créer un fichier ".env" et y ajouter les variables suivantes:
  *   PORT : port d'ecoute du service
  *  MONGO_URL : url vers la base de donnée MongoDB
  *  RABBIT_URL: url vers le cluster RabbitMQ "amqp://localhost" s'il est installer sur votre PC en local
  <p> </p>
* Dans <b>api-gateway</b> à la racine créer un fichier ".env" et y ajouter les variables suivantes:
  *   PORT : port d'ecoute du service
  * JWT_SECRET : pour decoder le token et sécurisé les requêtes qui arrivent sur les API de nos différents service (il doit être identique TOKEN_SECRET dans le service d'authentifcation)