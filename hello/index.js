// 示例插件：验证 GitHub 导入的完整流程
module.exports = function ({ React, RN, api }) {
  const { View, Text, TouchableOpacity, StyleSheet } = RN;
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#24292f' },
    desc: { fontSize: 14, color: '#666', marginBottom: 24 },
    card: { backgroundColor: '#f5f7fa', borderRadius: 10, padding: 16, marginBottom: 16 },
    label: { fontSize: 13, color: '#888' },
    value: { fontSize: 18, fontWeight: '600', color: '#111', marginTop: 4 },
  });
  return function HelloSample() {
    const [count, setCount] = React.useState(0);
    const [saved, setSaved] = React.useState('');

    React.useEffect(() => {
      api.storage.get('count').then(function (v) {
        if (v) setCount(parseInt(v, 10) || 0);
      }).catch(function () {});
      api.files.readText('state.txt').then(setSaved).catch(function () {});
    }, []);

    const increase = async function () {
      const next = count + 1;
      setCount(next);
      await api.storage.set('count', String(next));
      await api.files.writeText('state.txt', 'count=' + next);
      setSaved('count=' + next);
      api.vibrate.short().catch(function () {});
    };

    const copy = async function () {
      await api.clipboard.set('来自 Hello 示例插件：' + count);
    };

    return React.createElement(View, { style: styles.container },
      React.createElement(Text, { style: styles.title }, 'Hello 样例'),
      React.createElement(Text, { style: styles.desc }, '通过 GitHub 导入安装的插件'),
      React.createElement(View, { style: styles.card },
        React.createElement(Text, { style: styles.label }, '计数（持久化在插件私有存储）'),
        React.createElement(Text, { style: styles.value }, String(count))),
      React.createElement(View, { style: styles.card },
        React.createElement(Text, { style: styles.label }, '私有文件 state.txt'),
        React.createElement(Text, { style: styles.value }, saved || '（空）')),
      React.createElement(TouchableOpacity, {
        style: { backgroundColor: '#4a90d9', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
        onPress: increase,
      }, React.createElement(Text, { style: { color: '#fff', fontSize: 16 } }, '计数 +1（并存盘）')),
      React.createElement(TouchableOpacity, {
        style: { backgroundColor: '#24292f', padding: 14, borderRadius: 8, alignItems: 'center' },
        onPress: copy,
      }, React.createElement(Text, { style: { color: '#fff', fontSize: 16 } }, '复制计数到剪贴板')));
  };
};
