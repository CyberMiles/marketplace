<style lang="stylus">
icomoon-font-path ?= "../assets/fonts"

icon-close = "\e900"
icon-left-arrow = "\e901"
icon-right-arrow = "\e902"

@font-face
  font-family 'marketplace'
  src url(icomoon-font-path + '/marketplace.ttf?qvygcr') format('truetype'), url(icomoon-font-path + '/marketplace.woff?qvygcr') format('woff'), url(icomoon-font-path + '/marketplace.svg?qvygcr#marketplace') format('svg')
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
