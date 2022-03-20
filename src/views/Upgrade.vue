<template>
  <el-container>
    <el-aside width="300px" style="padding: 20px">
      <el-button type="info" icon="el-icon-upload" plain>Upgrade</el-button>
    </el-aside>
    <el-main>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Information Upgrade</span>
        </div>
        <div class="text item">
          name: <span>HUMAX-ABC</span>
        </div>
        <div class="text item">
          status: <span>connection</span>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import PostService from '../services/post.service';
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
    initData() {
      console.log(this.posts);
    }
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

.box-card {
  width: 480px;
}
</style>