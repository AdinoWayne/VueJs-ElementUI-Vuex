<template>
  <el-container>
    <el-main>
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span>Information Raspberry PI</span>
        </div>
        <div class="text item">
          HGJ310v4 Gateway IP: <span>192.168.50.1</span>
        </div>
        <div class="text item">
          SSID on Raspberry PI's Wifi Interface: <span>hvn_ssid</span>
        </div>
        <div class="text item">
          PASSWORD on Raspberry PI's Wifi Interface: <span>hvn_passowrd</span>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      content: ''
    };
  },
  computed: {
    ...mapGetters('post' ,["posts"])
  },
  created() {
  },
  mounted() {
    if (!this.posts || this.posts.length  === 0) {
      this.getPosts().then(() => this.initData());
    }
  },
  methods: {
    ...mapActions('post', ['getPosts']),
    initData() {}
  }
};
</script>
<style>
.text {
  font-size: 14px;
}

.el-button {
    min-width: 134px;
}


.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>