module.exports = function ({ React, RN, api }) {
  return function AsyncBad() {
    const load = async function () {
      const v = await api.storage.get('k');
      return v;
    };
    load();
    return React.createElement(RN.Text, null, 'async 反例');
  };
};
