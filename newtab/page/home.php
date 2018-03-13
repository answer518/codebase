<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>新标签页</title>
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <meta name="renderer" content="webkit" />
    <!-- 使用modjs作为资源加载器 -->
    <?php framework('static/js/lib/mod.js'); ?>
    
    <!-- 标记css输出位置 -->
    <?php placeholder('css');?>

    <!-- 加载css -->
    <?php import('static/css/reset.css'); ?>
    <?php import('static/css/common.css'); ?>
    <?php import('static/css/layout.css'); ?>
    <?php import('static/css/poup.css'); ?>
    <?php import('static/css/main.css'); ?>
    <?php import('static/res/intro/introjs.css'); ?>

    <!-- 加载同步的js -->
    <?php import('static/js/lib/jquery-2.2.4.min.js'); ?>
    <?php import('static/js/lib/template.js'); ?>
    <?php import('static/res/data/datasource.js'); ?>
</head>
<body class="light">
  <!-- 引导轮播组件 -->
  <?php widget("widget/navigation/navigation.php"); ?>
  <!-- 节日皮肤组件 -->
  <?php //widget("widget/skin/skin.php"); ?>
  <!-- 个人信息组件 -->
  <?php widget("widget/header/header.php"); ?>
  <!-- 搜索引擎组件 -->
  <?php widget("widget/search/search.php"); ?>
  <!-- 我的站点 -->
  <div id="wrapper">
    <?php widget("widget/main/main.php"); ?>
  </div>

  <!-- 引入侧边栏组件 -->
  <?php widget("widget/sidebar/sidebar.php"); ?>
  <!-- 引入文件夹弹框组件 -->
  <?php widget("widget/group/group.php"); ?>
  <!-- 加载一些对开发有用的片段 -->
  <?php widget("widget/fragment/fragment.php"); ?>
  <!-- 加载组件及对应依赖的js和css -->
  <div id="wallpapers">
    <div class="anim_fade_image"></div>
    <!-- poster 一个初始化的画面, 解决黑屏的问题  -->
    <video id="media" preload="true" loop="loop"></video>
  </div>
  <!-- 收集style片段以便在顶部输出,style标签可选 -->
  <?php styleStart() ?>
  <style type="text/css">  
    .swap {
      -webkit-animation: shake 0.5s ease infinite;
      transform: scale(1.1);
    }
  </style>
  <?php styleEnd() ?> 
  <script type="text/javascript" src="//pc-newtab.maxthonimg.com/static/res/intro/intro.js"></script>
  <!-- 收集script片段并分析其依赖。
    如果不想改变内嵌js的位置可以不用php包裹，但注意此时可能modjs还没加载 -->
  <?php scriptStart(); ?>
      <script type="text/javascript">
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('/sw.js', { scope: '/' })
        //         .then(function (reg) {
        //             // 注册
        //             if (reg.installing) {
        //                 console.log('Service worker installing at scope: ' + reg.scope);
        //             } else if (reg.waiting) {
        //                 console.log('Service worker installed at scope: ' + reg.scope);
        //             } else if (reg.active) {
        //                 console.log('Service worker active at scope: ' + reg.scope);
        //             }
        //         });
        // } else {
        //     console.log('Service Worker is not supported in this browser.');
        // }
        require('static/js/index.js');
      </script>
  <?php scriptEnd(); ?>
  <!-- js输出位置，放在底部加快页面解析 -->
  <?php placeholder('js'); ?>
</body>
</html>