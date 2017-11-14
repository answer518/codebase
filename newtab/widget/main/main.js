
var Service = require('widget/main/service');

function getGridDataList(mapList, next) {
    Service.getGridList(mapList);
}

module.exports = {
	getGridDataList: getGridDataList
}
