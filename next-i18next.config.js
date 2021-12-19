const path = require('path')
module.exports = {
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'es', 'da', 'ru'],
        localePath: path.resolve('./public/locales')
    }
}