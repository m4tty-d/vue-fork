import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VDialog,
  VCard,
  VRadioGroup,
  VSlider,
  VSubheader,
  VSwitch,
  VDivider,
  VMenu,
  VTabs,
  VBtnToggle,
  VResponsive,
  VTextField
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VDialog,
    VCard,
    VRadioGroup,
    VSlider,
    VSubheader,
    VSwitch,
    VDivider,
    VMenu,
    VTabs,
    VBtnToggle,
    VResponsive,
    VTextField
  },
  iconfont: 'md',
  theme: {
    primary: '#011627',
    secondary: '#2EC4B6',
    accent: '#2F404E',
    error: '#E71D36',
    info: '#2196F3',
    success: '#3EC493',
    warning: '#FF9F1C',
    babyPowder: '#FDFFFC'
  }
})
