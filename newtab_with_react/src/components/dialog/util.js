export default {
    bindMethods(methods, obj) {
        methods.forEach(func => {
            if(typeof obj[func] === 'function') {
                obj[func] = obj[func].bind(this);
            }
        })
    }
}