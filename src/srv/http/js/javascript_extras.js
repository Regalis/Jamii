
String.prototype.replaceAt = function (index, str) {
	var right = this.substring(index + 1);
	var left = this.substring(0, index);
	return left + str + right;
}


String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};
