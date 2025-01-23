module.exports = {
    secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : "A0K321FAFACNBU3213VKII8HGGUIEHGUIHREY7676VBHSB",
    api: process.env.NODE_ENV === 'production' ?  "https://api.loja-teste.ampliee.com" : "http://localhost:3000",
    loja: process.env.NODE_ENV === 'production' ? "https://loja-teste.ampliee.com" : "http://localhost:8000",
};  