module.exports = api => {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    // As migrations do drizzle-kit sao arquivos .sql embutidos no bundle como texto.
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
