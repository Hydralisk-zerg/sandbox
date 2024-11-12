const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' }, // Вы можете изменить основные переменные стилей здесь
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
