const helpers = require('./helpers');
const buildUtils = require('./build-utils');

const DefinePlugin = require('webpack/lib/DefinePlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ngcWebpack = require('ngc-webpack');

const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VisualizerPlugin = require('webpack-visualizer-plugin');

const TEMPLATE_PATH = './src/index.ejs';
const TEMPLATE_HTML = 'index.html';
const TEMPLATE_ADMIN_PATH = './src/admin.ejs';
const TEMPLATE_ADMIN_HTML = 'admin.html';

module.exports = function (options) {
  const isProd = options.env === 'production';
  const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, options.metadata || {});
  const ngcWebpackConfig = buildUtils.ngcWebpackSetup(isProd, METADATA);
  const supportES2015 = buildUtils.supportES2015(METADATA.tsConfigPath);

  const entry = {
    polyfills: './src/polyfills.ts',
    main: './src/main.ts',
    // admin: './src/admin.ts'
  };

  Object.assign(ngcWebpackConfig.plugin, {
    tsConfigPath: METADATA.tsConfigPath,
    mainPath: entry.main
  });

  return {
    entry: entry,
    resolve: {
      mainFields: [...(supportES2015 ? ['es2015'] : []), 'browser', 'module', 'main'],
      extensions: ['.ts', '.js', '.json'],
      modules: [helpers.root('src'), helpers.root('node_modules')],
      alias: buildUtils.rxjsAlias(supportES2015)
    },

    module: {
      rules: [
        ...ngcWebpackConfig.loaders,

        /**
         * To string and css loader support for *.css files (from Angular components)
         * Returns file content as string
         *
         */
        {
          test: /\.css$/,
          use: ['to-string-loader', 'css-loader'],
          exclude: [helpers.root('src', 'styles')]
        },

        /**
         * To string and sass loader support for *.scss files (from Angular components)
         * Returns compiled css content as string
         *
         */
        {
          test: /\.scss$/,
          use: ['to-string-loader', 'css-loader', 'sass-loader'],
          exclude: [helpers.root('src', 'styles')]
        },

        /**
         * Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          use: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        },

        /**
         * File loader for supporting images, for example, in CSS files.
         */
        {
          test: /\.(jpg|png|gif)$/,
          use: 'file-loader'
        },

        /* File loader for supporting fonts, for example, in CSS files.
        */
        {
          test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
          use: 'file-loader'
        },

        // Bootstrap 4
        {
          test: /bootstrap\/dist\/js\/umd\//,
          use: 'imports?jQuery=jquery'
        }
      ]
    },
    plugins: [
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'AOT': METADATA.AOT,
        'process.env.ENV': JSON.stringify(METADATA.ENV),
        'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
        'process.env.HMR': METADATA.HMR
      }),

      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),

      new CommonsChunkPlugin({
        minChunks: Infinity,
        name: 'inline'
      }),
      new CommonsChunkPlugin({
        name: 'main',
        async: 'common',
        children: true,
        minChunks: 2
      }),

      new CopyWebpackPlugin([
          {
            from: './assets',
            to: './assets'
          },
          // {
          //   from: 'node_modules/font-awesome/css/font-awesome.min.css',
          //   to: 'assets/font-awesome/css/font-awesome.min.css',
          // },
          // {
          //   from: 'node_modules/font-awesome/fonts',
          //   to: 'assets/font-awesome/fonts'
          // }
        ],
        isProd ? {ignore: ['mock-data/**/*']} : undefined
      ),

      new HtmlWebpackPlugin({
        template: TEMPLATE_PATH,
        filename: TEMPLATE_HTML,
        title: METADATA.title,
        chunksSortMode: function (a, b) {
          const entryPoints = ["inline", "polyfills", "sw-register", "styles", "vendor", "main"];
          return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
        },
        metadata: METADATA,
        inject: 'body',
        xhtml: true,
        minify: isProd ? {
          caseSensitive: true,
          collapseWhitespace: true,
          keepClosingSlash: true
        } : false
      }),

      new ScriptExtHtmlWebpackPlugin({
        sync: /inline|polyfills|vendor/,
        defaultAttribute: 'async',
        preload: [/polyfills|vendor|main/],
        prefetch: [/chunk/]
      }),

      new HtmlElementsPlugin({
        headTags: require('./head-config.common')
      }),

      new LoaderOptionsPlugin({}),
      new ngcWebpack.NgcWebpackPlugin(ngcWebpackConfig.plugin),

      new InlineManifestWebpackPlugin(),

      // new ProvidePlugin({
      //   jQuery: 'jquery',
      //   jquery: 'jquery',
      //   $: 'jquery',
      //   'Popper': 'popper.js',
      //   'Tether': 'tether',
      //   'window.Tether': 'tether',
      //   //---------------------------------------------------
      //   //------------- temporary workaround ----------------
      //   // https://github.com/shakacode/bootstrap-loader/issues/172#issuecomment-247205500
      //   //this requires exports-loader installed from npm
      //   Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
      //   Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      //   Button: 'exports-loader?Button!bootstrap/js/dist/button',
      //   Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      //   Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      //   Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      //   Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      //   Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      //   Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
      //   Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
      //   Util: 'exports-loader?Util!bootstrap/js/dist/util'
      //   //---------------------------------------------------
      // }),

      isProd ? () => {} : new BundleAnalyzerPlugin({
        // Can be `server`, `static` or `disabled`.
        // In `server` mode analyzer will start HTTP server to show bundle report.
        // In `static` mode single HTML file with bundle report will be generated.
        // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
        analyzerMode: 'disabled',
        // Host that will be used in `server` mode to start HTTP server.
        analyzerHost: '127.0.0.1',
        // Port that will be used in `server` mode to start HTTP server.
        analyzerPort: 8888,
        // Path to bundle report file that will be generated in `static` mode.
        // Relative to bundles output directory.
        reportFilename: 'webpack-bundle-analyzer-report.html',
        // Automatically open report in default browser
        openAnalyzer: true,
        // If `true`, Webpack Stats JSON file will be generated in bundles output directory
        generateStatsFile: true,
        // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
        // Relative to bundles output directory.
        statsFilename: 'webpack-bundle-analyzer-report.json',
        // Options for `stats.toJson()` method.
        // For example you can exclude sources of your modules from stats file with `source: false` option.
        // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null,
        // Log level. Can be 'info', 'warn', 'error' or 'silent'.
        logLevel: 'info'
      }),
      isProd ? () => {} : new VisualizerPlugin({filename: './webpack-visualizer-report.html'})
    ],
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
}
