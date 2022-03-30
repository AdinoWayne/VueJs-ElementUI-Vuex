<template>
  <el-container>
    <el-main>
      <el-button type="primary" icon="el-icon-connection" plain>Connection</el-button>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>Information Cloud</span>
              </div>
              <div class="text item">
                name: <span>HUMAX-ABC</span>
              </div>
              <div class="text item">
                status: <span>connection</span>
              </div>
            </el-card>
          </div>
          </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>Information HGJ310v4</span>
              </div>
              <div class="text item">
                name: <span>HUMAX-ABC</span>
              </div>
              <div class="text item">
                status: <span>connection</span>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <D3 />
    </el-main>
  </el-container>
</template>

<script>
import D3 from './components/D3.vue';
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      content: ''
    };
  },
  components: {
    D3
  },
  computed: {
    ...mapGetters('pi' ,["pi"])
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions('pi', ['getReworkStates']),
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