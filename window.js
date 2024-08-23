(function () {
  try {
    return (new Function('return this')());
  } catch (e) {
    if (typeof window !== "undefined") {
      return window;
    } else if (typeof global !== "undefined") {
      return global;
    } else {
      console.log('unable to locate global object');
      return {};
    }
  }
})()
