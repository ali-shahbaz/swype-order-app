const { i18n } = require('./next-i18next.config')
module.exports = {
  distDir: 'build',
  reactStrictMode: true,
  images: {
    domains: ['morepos.blob.core.windows.net'],
  },
  i18n
}