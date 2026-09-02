// Polyfills for Node 18 -> Node 20 Array methods
if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function(compareFn) {
    return [...this].sort(compareFn);
  };
}
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function() {
    return [...this].reverse();
  };
}
if (!Array.prototype.toSpliced) {
  Array.prototype.toSpliced = function(...args) {
    const arr = [...this];
    arr.splice(...args);
    return arr;
  };
}
if (!Array.prototype.with) {
  Array.prototype.with = function(index, value) {
    const arr = [...this];
    arr[index] = value;
    return arr;
  };
}
