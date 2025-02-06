const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware')
const {protect} = require('../middleware/auth');

const LoadBalancer = require('../utils/loadBalancer');

// Définission des instances de chaque microservice
const authBalancer = new LoadBalancer(['http://localhost:5001']);
const postBalancer = new LoadBalancer(['http://localhost:5002']);
const chatBalancer = new LoadBalancer(['http://localhost:5003']);

module.exports = (app) => {
    // redirection vers le service Authentification
    app.use(
        '/auth',
        createProxyMiddleware({
            target: authBalancer.getNextServer(),
            changeOrigin: true,
            router: ()=> authBalancer.getNextServer(),
            on: {
                proxyReq: fixRequestBody
            }

        })
    )
    // Redirection vers le service Post
    app.use(
        '/posts', protect,
        createProxyMiddleware({
            target: postBalancer.getNextServer(),
            changeOrigin: true,
            router: () => postBalancer.getNextServer(),
            on: {
                proxyReq: (proxyReq, req) => {
                    // Ajouter les en-têtes personnalisés à la requête envoyée au microservice
                    if (req.headers['x-user-id']) {
                        proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
                    }
                }
            },
        })
    );

    // Redirection vers le service Chat
    app.use(
        '/chat', protect,
        createProxyMiddleware({
            target: chatBalancer.getNextServer(),
            changeOrigin: true,
            router: () => chatBalancer.getNextServer(),
            on: {
                proxyReq: fixRequestBody
            }
        })
    );

}