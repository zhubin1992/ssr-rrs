const webpackConfig = require('./config')

const AvatarCount = 16
const env = process.env.NODE_ENV === 'development'
const publishPath = env ? webpackConfig.publicPathDev : webpackConfig.publicPath
const avatarList = {
  1: 'icons8-avengers-100',
  2: 'icons8-batman-100',
  3: 'icons8-batman-logo-100',
  4: 'icons8-captain-america-100',
  5: 'icons8-fantastic-four-100',
  6: 'icons8-iron-man-100',
  7: 'icons8-spider-man-head-100',
  8: 'icons8-spider-man-new-100',
  9: 'icons8-super-mario-100',
  10: 'icons8-superman-100',
  11: 'icons8-the-flash-head-100',
  12: 'icons8-the-flash-sign-100',
  13: 'icons8-thor-100',
  14: 'icons8-venom-head-100',
  15: 'icons8-wonder-woman-100',
  16: 'icons8-x-men-100'
}

module.exports = function getRandomAvatar () {
  const number = Math.floor(Math.random() * AvatarCount + 1)
  return `${publishPath}/public/${avatarList[number]}.png`
}
