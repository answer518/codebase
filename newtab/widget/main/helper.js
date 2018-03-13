/**
 * 辅助类 helper
 * @author guotingjie
 */
var Tools = require('static/js/tools.js');

/**
 * 用于转换图片url
 * @param  {[type]} item [description]
 * @return {[type]}      [description]
 */
function tranData(item) {
    if (map_list[item.url]) { // map中有md5
        item['sq_img'] = map_list[item.url]['sq_img'] || 'offline.png';
        item['re_img'] = map_list[item.url]['re_img'] || 'offline.png';
        item['re_md5sum'] = map_list[item.url]['re_md5sum'] || '';
        item['sq_md5sum'] = map_list[item.url]['sq_md5sum'] || '';
    }
    if (!item.image && !item.colorBlock) {
        item.colorBlock = 'color-block-' + (parseInt(Math.random() * 9, 10) + 1);
    } else {
        if (item.image) {
            delete item.colorBlock;
            item.image = item.image.replace(/^http:\/\//, 'https://');
            if (!item.image.match(/^mx:\/\//) && !item.image.match(/^https?:\/\/fastdail-img/) ) {
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
                item.image = cdnServer + '/image/logo/Sq/' + img;
            }
        }
    }
    return item;
}

module.exports = {
    tranData : tranData
};