import { mapGetters, mapActions } from "vuex";
import { IS_RENDER } from "@/store/types/getters.type";
import { CHANGE_RENDER } from "@/store/types/actions.type";

let routerMixin = {
  computed: {
    ...mapGetters({ IS_RENDER })
  },
  methods: {
    ...mapActions({
      CHANGE_RENDER
    })
  }
};
export default routerMixin;
