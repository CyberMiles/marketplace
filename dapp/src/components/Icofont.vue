<style lang="stylus">
icomoon-font-path ?= "../assets/fonts"

icon-home = "\e904"
icon-profile = "\e905"
icon-search = "\e906"
icon-copy = "\e903"
icon-close = "\e900"
icon-left-arrow = "\e901"
icon-right-arrow = "\e902"

@font-face
  font-family 'marketplace'
  src url(icomoon-font-path + '/marketplace.ttf?m4pvpz') format('truetype'), url(icomoon-font-path + '/marketplace.woff?m4pvpz') format('woff'), url(icomoon-font-path + '/marketplace.svg?m4pvpz#marketplace') format('svg')
  font-weight normal
  font-style normal

[class^="icon-"], [class*=" icon-"]
  font-family 'marketplace' !important
  speak none
  font-style normal
  font-weight normal
  font-variant normal
  text-transform none
  line-height 1

  /* Better Font Rendering =========== */
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

.icon-home
  &:before
    content icon-home
.icon-profile
  &:before
    content icon-profile
    color #c7c7c7
.icon-search
  &:before
    content icon-search
    color #c7c7c7
.icon-copy
  &:before
    content icon-copy
    color #ff3f0f
.icon-close
  &:before
    content icon-close
.icon-left-arrow
  &:before
    content icon-left-arrow
.icon-right-arrow
  &:before
    content icon-right-arrow
</style>
