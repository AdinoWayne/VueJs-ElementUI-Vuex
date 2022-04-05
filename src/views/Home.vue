<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12" class="card-content">
          <div class="grid-content bg-purple">
            <el-card class="box-card card-information">
              <div
                slot="header"
                class="clearfix"
              >
                <span>Cloud Information</span>
              </div>
              <div class="text item">
                FW Name: <span>{{ data.cloud.fw_name }}</span>
              </div>
              <div class="text item">
                Progress: <span>{{ data.cloud.curr_state }}</span>
              </div>
              <div class="text item">
                Status: <span>{{ data.cloud.cloud_connected ? 'Connection' : 'Disconnection' }}</span>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="12" class="card-content">
          <div class="grid-content bg-purple">
            <el-card class="box-card card-information">
              <div
                slot="header"
                class="clearfix"
              >
                <span>HGJ310v4 Information</span>
              </div>
              <div class="text item">
                Version: <span>{{ data.v4.fw_ver }}</span>
              </div>
              <div class="text item">
                MAC: <span>{{ data.v4.cm_mac }}</span>
              </div>
              <div class="text item">
                Number: <span>{{ data.v4.sn_num }}</span>
              </div>
              <div class="text item">
                <el-button type="primary" @click="() => putMode(MODE.REWORK__ALL_AUTO)" v-if="data.pi_rework_mode.indexOf(MODE.REWORK__ALL_AUTO) !== -1">Auto</el-button>
                <el-button type="primary" @click="() => putMode(MODE.REWORK__ALL_MANUAL)" v-else>Manual</el-button>
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
import { MODE } from './../common/constants';

export default {
  name: 'Home',
  components: {
    D3
  },
  data() {
    return {
      data: {
        cloud: {},
        v4: {},
        pi_rework_mode: ""
      }
    };
  },
  computed: {
    ...mapGetters('pi' ,["pi"]),
    MODE() {
      return MODE;
    }
  },
  created() {},
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions('pi', ['getInfoCloud', 'getV4Info', 'getReworkMode', 'doAction']),
    fetchData() {
      let $q = [];
      $q.push(this.getInfoCloud());
      $q.push(this.getV4Info());
      $q.push(this.getReworkMode());
      Promise.all($q).then(() => {
        this.initData();
      });
    },
    initData() {
      if (this.pi) {
        this.data = this.pi;
      }
    },
    putMode(param) {
      this.doAction({ action_name: param, num: -1}).finally(() => {
          this.getReworkMode().finally(() => {
            this.initData();
          })
      })
    }
  }
};
</script>
<style scope>
.text {
  font-size: 14px;
}

.el-button {
    min-width: 134px;
}

.item {
  margin-bottom: 18px;
}

.card-information {
  min-height: 220px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.card-content .el-card {
  min-height: 278px;
}
</style>