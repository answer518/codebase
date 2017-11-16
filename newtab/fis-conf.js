//模块化方案，本项目选中CommonJS方案(同样支持异步加载哈)
fis.hook('module', {
    mode: 'commonJs'
});

// widget发布时产出到 /static 目录下
fis.match('/widget/**', {
    isMod: true,
    release: '/static/$0'
});

//资源配置表
fis.match('/map.json', {
    release: '/tpl/config/map.json'
})

//页面和widget模板
fis.match("/{widget,page}/**.php", {
    isMod: true,
    isHtmlLike: true,
    url: '$&', //此处注意，php加载的时候已带tpl目录，所以路径得修正
    release: '/tpl/$&'
})

//文档就不发布了
fis.match("/doc/**", {
    release: false
})

//开启组件同名依赖
fis.match('*.{html,js,php}', {
    useSameNameRequire: true
});

fis.media('dev').match('*', {
    useHash: false,
    useSprite: false,
    optimizer: null
});

fis.media('dist').match('::package', {
  packager: fis.plugin('map', { // 可以控制文件的顺序
    '/static/pkg/lib.js': [
      '/static/js/jquery-1.2.6.js',
      '/static/js/jquery.easing.1.3.js',
      '/static/js/coda-slider.js',
      '/static/js/mod.js'
    ],
    '/static/pkg/main.js' : [
      '/widget/**/*.js'
    ]
  })
})


/**
 * 页面所有资源打成一个文件
 * 缺点：不能提取公共资源以提升性能
 * @type {[type]}
 */
// fis.match('::package', {
//     postpackager: fis.plugin('loader', {
//         allInOne: true
//     })
// });

/**
 * 页面所有资源打成一个文件
 * 缺点：默认按文件名顺序打包，不够灵活
 * @type {[type]}
 */
// fis.match('*.js', {
//   useHash: false,
//   optimizer: fis.plugin('uglify-js', {
//     // option of uglify-js
//   }),
//   packTo: '/static/pkg/main.js'
// }).match('/static/js/**.js', { // 公共资源打一个包
//   packTo: '/static/pkg/lib.js'
// })


// 编译环境压缩和合并
// fis.media('dist').match('*.{js,png,css}', {
//     useSprite: true,
//     useHash: true
// });