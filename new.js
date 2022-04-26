function objectFactory() {
  const _object = new Object();
  const Constructor = Array.prototype.slice.call(arguments);

  _object.__proto__ = Constructor.prototype;

  const ret = Constructor.apply(_object, arguments);

  return typeof ret === 'object' ? ret : _object;
}

function objectFactory_1(object) {
  const _object = new Object();
  Object.setPrototypeOf(_object, object.prototype); 
  const args = Array.prototype.slice.call(arguments, 1);
  const ret = object.apply(_object, args);
  return ret instanceof Object ? ret : _object;
}
