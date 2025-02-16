module.exports = {
  "/api": {
    target: "http://localhost:7071",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    bypass: function (req, res, proxyOptions) {
      console.log("Proxying request:", req.url);
      console.log("Request headers:", req.headers);
    },
  },
};
