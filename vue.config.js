const path = require('path');
const { Command } = require('commander');
//const ChangeResultPlugin = require('./build/plugs/change.result.plugin');
const webpack = require('webpack');
const pack = require('./package.json');
const fs = require('fs');

/** 自定义参数 start */
const program = new Command();
program
  //.option('-V, --view <type>', 'output extra debugging')
  .option('-S, --small', 'show small view 小页面')
  .option('-L, --large', 'show large view 大页面')
  .option('-P, --platform <type>', '运行系统平台 android, ios, windows, linux', 'windows')
  .option('-T, --target <type>', '运行目标 android, ios, electron, browser', 'browser')
  .option('-d, --dev', '是否是开发模式')
  .option('-t, --title <type>', '应用标题', pack.name)
  .parse(process.argv);

process.env.View = program.large ? `large` : `small`;
process.env.Platform = `${program.platform}`;
process.env.Target = `${program.target}`;
const isDev = program.dev== true ? true : false;
const title = program.title;

console.log('VUE_APP_PAGE_ID', isDev, program.opts());
deleteDir(path.resolve('electron/app'));

/** 自定义参数 end */

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  productionSourceMap: isDev, 
  configureWebpack: {
    resolveLoader: {
      modules: ['node_modules', './build/loaders/'],
    },
    plugins: [
      //new ChangeResultPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.(t|j)s$/,
          use: [
            {
              loader: 'view-loader',
              options: {
                view: process.env.View
              },
            },
          ],
        },
      ],
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= title ;//'你想设置的title名字'
        return args
      })
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@coms', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@common', resolve('src/common'))
      .set('@mzui', resolve('src/components/mzui'))
      .set('@api', resolve('src/api'));

    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0]['process.env'], {
        View: program.large ? `'large'` : `'small'`,
        Platform: `'${program.platform}'`,
        Target: `'${program.target}'`,
      });
      /*     Object.assign(definitions[0]['global'], {
        view: program.large ? `'large'` : `'small'`,
      }); */
      return definitions;
    });
    
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true, //less 配置
      },
    },
  },
  devServer: {
    port: '4000',
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        ws: true,
        changeOrigin: true,
      },
      '/foo': {
        target: '<other_url>',
      },
    },
  },
};


function deleteDir(path) {
	var files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file, index) {
			var curPath = path + "/" + file;
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteDir(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};