/**
 * 问卷调查
 * @return {[type]} [description]
 */

'use strict';
// 我的站点
define('static/js/banner/question.js', function (require, exports, module) {
    if(navigator.language.toLocaleLowerCase() !== 'zh-cn' || localStorage.getItem('question-naire-collapse') === 'done') return;
    var questionTpl = '<div id="question">\
       <button class="close-btn close-ad"></button>\
       <img src="https://pc-newtab.maxthonimg.com/static/img/question.png" alt="" width="118" height="98" />\
    </div';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML='#question {position:absolute; top:40px; left:10px;width:130px;cursor:pointer;z-index:10;} #question .close-ad {width:16px;height:16px;right: 6px;position:absolute;background-color:rgba(0,0,0,0.2);} #question .close-ad::after,#question .close-ad::before {left: 3px;}';
    document.getElementsByTagName('HEAD')[0].appendChild(style);

    $('.header').append(questionTpl);

    $('#question').on('click', function() {
        require('static/js/api.js').useApi('newTabUpground', { 'url': 'https://www.wenjuan.in/s/FjUVJz/' });
        localStorage.setItem('question-naire-collapse', 'done');
        $(this).remove();
    });

    $('#question').on('click', '.close-ad', function(e) {
       e.stopPropagation();
       localStorage.setItem('question-naire-collapse', 'done');
       $('#question').remove();
    });
});