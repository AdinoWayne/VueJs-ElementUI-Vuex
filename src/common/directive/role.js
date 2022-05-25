import { getLocalStorage } from "@/common/utils";
import Vue from "vue";
import { STORAGE_USER_ROLE } from "@/common/constants";

const role = {
  inserted(el, binding) {
    const { value } = binding;
    const role = getLocalStorage(STORAGE_USER_ROLE);

    if (value) {
      if (
        (typeof value === "object" && value.findIndex(o => o === role) < 0) ||
        (typeof value === "string" && value !== role)
      ) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  }
};

Vue.directive("role", role);

export default role;
