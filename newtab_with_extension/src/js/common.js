const $ = selector => document.querySelector(selector) || null;

Element.prototype.addClass = function(classStr) {

    if (this.classList.contains(classStr)) {
        return true
    }
    this.classList.add(classStr)
}

Element.prototype.removeClass = function(classStr) {
    this.classList.contains(classStr) && this.classList.remove(classStr)
}

Element.prototype.hasClass = function(classStr) {
    return this.classList.contains(classStr)
}

Element.prototype.on = Element.prototype.addEventListener