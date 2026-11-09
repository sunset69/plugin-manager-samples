module.exports = function ({ React }) {
  return function Broken() {
    return React.createElement(React.Fragment, null);
  };
};
