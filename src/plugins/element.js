import Vue from "vue";
import Element from "element-ui";
// import "@/assets/theme/index.css";
import I18n from "@/plugins/i18n";

require(`@/assets/theme/index.css`);

Vue.use(Element, {
  i18n: (key, value) => I18n.t(key, value)
});
