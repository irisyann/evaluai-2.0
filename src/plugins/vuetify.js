// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import * as labsComponents from 'vuetify/labs/components'

const myCustomDarkTheme = {
  dark: true,
  colors: {
    primary: '#735FFA',
    secondary: '#FF4582',
    accent: '#E3CBFF',
    background: '#131820',
    defaultblack: '#131820',
  },
}

export default createVuetify({
  components: {
    ...labsComponents,
  },
  theme: {
    defaultTheme: 'myCustomDarkTheme',
    themes: {
      myCustomDarkTheme,
    },
  },
})

