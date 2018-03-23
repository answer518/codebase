/**
 * Binds event listeners.
 */

import ApiHandle from './ApiHandle';

function init() {

	const apiHandle = new ApiHandle();
    var list = apiHandle.mostVisited;
    list = apiHandle.mostVisited.splice(0, Math.min(4, list.length));

    console.log(list);
}

document.addEventListener('DOMContentLoaded', init);