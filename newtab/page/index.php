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
    <?php import('static/css/main.css'); ?>

    <!-- 加载同步的js -->
    <?php import('static/js/lib/jquery-2.2.4.min.js'); ?>
    <?php import('static/js/lib/dialog.js'); ?>
    <?php import('static/js/lib/template.js'); ?>
</head>
<body>

  <!-- 引入皮肤组件 -->
  <?php widget("widget/skin/skin.php"); ?>

  <!-- 顶通结束 -->
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
    <!-- poster 一个初始化的画面, 解决黑屏的问题  -->
    <video id="media" preload="true" loop="loop" style="display: none;"></video>
  </div>
  <!-- 收集style片段以便在顶部输出,style标签可选 -->
  <?php styleStart() ?>
  <style type="text/css"> 
    /*footer{
       margin: *;
    }*/
  </style>
  <?php styleEnd() ?> 
  
  <!-- 收集script片段并分析其依赖。
    如果不想改变内嵌js的位置可以不用php包裹，但注意此时可能modjs还没加载 -->
  <?php scriptStart(); ?>
      <script type="text/javascript">
        require('static/js/index.js', function() {});
      </script>
  <?php scriptEnd(); ?>

  <!-- js输出位置，放在底部加快页面解析 -->
  <?php placeholder('js'); ?>
  
</body>
</html>