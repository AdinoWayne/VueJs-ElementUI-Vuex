import Vue from "vue";
import VueI18n from "vue-i18n";
import arLocale from "element-ui/lib/locale/lang/ar";
import deLocale from "element-ui/lib/locale/lang/de";
import enLocale from "element-ui/lib/locale/lang/en";
import faLocale from "element-ui/lib/locale/lang/fa";
import jaLocale from "element-ui/lib/locale/lang/ja";
import koLocale from "element-ui/lib/locale/lang/ko";
import ptLocale from "element-ui/lib/locale/lang/pt";
import thLocale from "element-ui/lib/locale/lang/th";
import viLocale from "element-ui/lib/locale/lang/vi";

Vue.use(VueI18n);

let loadLocaleMessages = () => {
  let languages = null;
  process.env.VUE_APP_MODEL !== "" && process.env.VUE_APP_MODEL
    ? (languages = require.context(
        "@/products/" + process.env.VUE_APP_MODEL + "/languages",
        true,
        /[A-Za-z0-9-_,\s]+\.json$/i
      ))
    : (languages = require.context(
        "@/products/base/languages",
        true,
        /[A-Za-z0-9-_,\s]+\.json$/i
      ));
  const messages = {};
  const elMessage = {
    ar: {
      ...arLocale
    },
    de: {
      ...deLocale
    },
    en: {
      ...enLocale
    },
    fa: {
      ...faLocale
    },
    ja: {
      ...jaLocale
    },
    ko: {
      ...koLocale
    },
    pt: {
      ...ptLocale
    },
    th: {
      ...thLocale
    },
    vi: {
      ...viLocale
    }
  };
  languages.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = languages(key);
      Object.keys(messages[locale]).forEach(obj => {
        if (
          messages[locale][obj].indexOf("{{") >= 0 &&
          messages[locale][obj].indexOf("}}") >= 0
        ) {
          messages[locale][obj] = messages[locale][obj].split("{{").join("{");
          messages[locale][obj] = messages[locale][obj].split("}}").join("}");
        }
      });
    }
  });
  Object.keys(messages).forEach(loc => {
    messages[loc] = Object.assign(messages[loc], elMessage[loc]);
  });
  return messages;
};

export default new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: loadLocaleMessages()
});
