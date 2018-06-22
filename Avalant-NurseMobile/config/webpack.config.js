var path = require('path');
var webpack = require('webpack');
var ionicWebpackFactory = require(process.env.IONIC_WEBPACK_FACTORY);

var dotenvConfig = global.dotenvConfig || {};

require('dotenv').config(dotenvConfig);

module.exports = {
    entry: process.env.IONIC_APP_ENTRY_POINT,
    output: {
        path: '{{BUILD}}',
        publicPath: 'build/',
        filename: process.env.IONIC_OUTPUT_JS_FILE_NAME,
        devtoolModuleFilenameTemplate: ionicWebpackFactory.getSourceMapperFunction(),
    },
    devtool: process.env.IONIC_SOURCE_MAP_TYPE,

    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [path.resolve('node_modules')]
    },

    externals: {
        google: 'google',
    },

    module: {
        loaders: [{
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.ts$/,
                loader: process.env.IONIC_WEBPACK_LOADER
            },
            {
                test: /\.js$/,
                loader: process.env.IONIC_WEBPACK_TRANSPILE_LOADER
            }
        ]
    },

    plugins: getPlugins(),

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};


function getPlugins() {

    console.log(' IONIC ENV : ' + process.env.IONIC_ENV);

    var environment = {
        APP_VERSION: require('./version-generator'),
        IONIC_ENV: JSON.stringify(process.env.IONIC_ENV),
        REST_API: {
            SOCIAL_COM: {
                URL: JSON.stringify(process.env.SCM_REST_API_URL),
            },
            EAF: {
                URL: JSON.stringify(process.env.EAF_REST_API_URL),
                USERNAME: JSON.stringify(process.env.EAF_USERNAME),
                PASSWORD: JSON.stringify(process.env.EAF_PASSWORD),
            },
            MASTERWEB: {
                URL: JSON.stringify(process.env.EAF_MASTERWEB_URL),
            },
            SMS_OTP_WEBSERVICE: {
                URL: JSON.stringify(process.env.SMS_OTP_WEBSERVICE),
            },
            HCM_SERVICE_URL: {
                URL: JSON.stringify(process.env.HCM_SERVICE_URL),
                EAF_REST_URL: JSON.stringify(process.env.HCM_EAF_REST_URL),
            }
        },
        WEB_SOCKET: {
            UEARN: {
                URL: JSON.stringify(process.env.UEARN_NODE_SERVER_URL),
                PATH: JSON.stringify(process.env.UEARN_NODE_SERVER_PATH),
            },
            MESSENGER: {
                URL: JSON.stringify(process.env.MESSENGER_SERVER_URL),
            },
        },
        APPLICATION: {
            ROOT_PAGE: JSON.stringify(process.env.ROOT_PAGE),
        }
    };

    var plugins = [
        ionicWebpackFactory.getIonicEnvironmentPlugin(),
        new webpack.DefinePlugin({
            ENV: environment,
            //...
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' })
    ];

    if (process.env.IONIC_ENV === 'prod' || process.env.IONIC_ENV === 'prod-mobile') {
        // This helps ensure the builds are consistent if source hasn't changed:
        plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
        // plugins.push(new webpack.optimize.UglifyJsPlugin());
    }
    return plugins;

}