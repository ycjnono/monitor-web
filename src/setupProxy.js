const proxy = require('http-proxy-middleware')

module.exports = function (app){
    app.use(
        proxy.createProxyMiddleware('/console',{
            target: 'http://127.0.0.1:8080',
            changeOrigin: true,
            onProxyReq: function (proxyReq, req, res, options){
                if (req.body){
                    let reqBody = JSON.stringify(req.body)
                    proxyReq.setHeader("Content-Type", "application/json")
                    proxyReq.write(reqBody)
                }
            }
        })
    )
}
