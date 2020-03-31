const path = require("path");
const WebPackPWAManifest = require("./client/node_modules/webpack-pwa-manifest");

module.exports = {
    mode: "development",
    entry: {
        app: "./assets/js/index.js",
    },
    output: {
        path: __dirname + "/client/dist",
        filename: "[name].bundle.js"
      },
    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    } 
                }
            }
        ]
    },
    plugins: [
        new WebPackPWAManifest({
            name: "Offline/Online Budget App",
            short_name: "Offline Budget",
            background_color: "#FFFFFF",
            description: "track budget on/offline",
            theme_color: "#FFFFFF",
            start_url: "/",
            icons: [{
                src: path.resolve("../public/icons/icon-192x192.png"),
                sizes: [96,128,192,256,384,512],
                destination: path.join('public',"icons")
            }]
        })
    ]
};
