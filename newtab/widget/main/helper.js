/**
 * 辅助类 helper
 * @author guotingjie
 */
var Tools = require('static/js/tools.js');
var helper = (function() {

    template.on('isThumbImge', function(src) {
        return src.slice(0, src.length) === 'mx://thumbs/';
    });

    return {
        hot_grid_html: '<li class="top grid">\
                    <% if(!!this.image) {%>\
                        <a href="<%= this.url || \"\" %>" target="_blank" style="background-image:url(<%= this.image %>);">\
                        </a>\
                    <% } else { %>\
                        <a href="<%= this.url || \"\" %>" %>" target="_blank">\
                            <div colorBlock="<%=this.colorBlock || \"\" %>" class="color-block <%=this.colorBlock || \"\" %>">\
                                <%=this.title ? this.title.substring(0, 1) : \"\" %>\
                            </div>\
                        </a>\
                    <% } %>\
                    </li>',
        grid_html: '<li class="main grid">\
                    <a href="<%= this.url || \"\" %>" title="" target="_blank" <% if(!!this.image) {%> <% } else {%> class="<%=this.colorBlock || \"\" %>" <% } %>\
                        <% if(this.isThumbImge(this.image)) {%>style="background-color:#fff;"<% } %>>\
                        <% if(!!this.image) {%>\
                            <% if(this.isThumbImge(this.image)) {%>\
                                <p class="thumb" style="background-image:url(<%= this.image%>);"></p>\
                            <% } else {%>\
                                <img src="<%= this.image %>" alt="<%=this.title || \"\" %>">\
                            <% } %>\
                        <% } else { %>\
                             <div colorBlock="<%=this.colorBlock || \"\" %>" class="color-block"><%=this.title || \"\" %></div>\
                        <% } %>\
                    </a>\
                    <div class="function">\
                        <strong class="title"><%=this.title || \"\" %></strong>\
                        <% if(this.isThumbImge(this.image)) {%><button class="refresh">×</button><% } %>\
                        <button class="edit"></button>\
                        <button class="delete"></button>\
                    </div>\
                </li>',
        empty_grid_html: '<li class="top grid"><a class="empty">&nbsp;</a></li>',
        add_grid: '<li class="grid top"><a class="add" href="javascript:void(0);"><i class="sprite sprite-circle"></i></a></li>'
    }
})();

/**
 * 用于转换图片url
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
helper.tranData = function(item) {
    if (!item.image && !item.colorBlock) {
        item.colorBlock = 'color-block-' + (parseInt(Math.random() * 9, 10) + 1);
    } else {
        if (item.image) {
            delete item.colorBlock;
            item.image = item.image.replace(/^http:\/\//, 'https://');
            if (!item.image.match(/^mx:\/\/thumbs\/\?/) && !item.image.match(/^https?:\/\/fastdail-img/)) {
                var img;
                if (item['sq_img'] || item['re_img']) {
                    img = item.isHot === true ? item['sq_img'] : item['re_img']
                } else {
                    var match = item.image.match(/(?:Re|Sq)\/(.+(\.jpg|png|gif)+)(?:\.webp)?/);
                    img = match ? match[1] : 'offline.png'
                }

                if (Tools.isSupportWebp()) img += '.webp'
                if (item['sq_md5sum'] || item['re_md5sum']) {
                    img += '?md5=' + (item.isHot === true ? item['sq_md5sum'] : item['re_md5sum'])
                }
                item.image = cdnServer + '/image/logo/' + (item.isHot === true ? 'Sq/' : 'Re/') + img;
            }
        }
    }
    return item;
}

helper.render = function(_this) {
    return template(_this.isHot === true ? this.hot_grid_html : this.grid_html, helper.tranData(_this));
}

module.exports = helper;
