<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col
          :span="12"
          class="card-content"
        >
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
        <el-col
          :span="12"
          class="card-content"
        >
          <div class="grid-content bg-purple">
            <el-card class="box-card card-information">
              <div
                slot="header"
                class="clearfix"
              >
                <span>HGJ310v4 Information</span>
              </div>
              <div class="text item">
                FW Version: <span>{{ data.v4.fw_ver }}</span>
              </div>
              <div class="text item">
                MAC: <span>{{ data.v4.cm_mac }}</span>
              </div>
              <div class="text item">
                Number: <span>{{ data.v4.sn_num }}</span>
              </div>
              <div class="text item">
                <el-button
                  size="small"
                  type="primary"
                  @click="() => updateVersion()"
                  :disabled="data.version && data.version.pi_rework_latest_ver == data.version.get_rework_current_ver"
                >
                  Update Version
                </el-button>
                <el-button
                  v-if="data.pi_rework_mode.indexOf(MODE.REWORK__ALL_AUTO) !== -1"
                  size="small"
                  type="primary"
                  @click="() => putMode(MODE.REWORK__ALL_AUTO)"
                >
                  Auto
                </el-button>
                <el-button
                  v-else
                  size="small"
                  type="primary"
                  @click="() => putMode(MODE.REWORK__ALL_MANUAL)"
                >
                  Manual
                </el-button>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-container style="margin-top: 10px">
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix"
          >
            <span>Progress Step</span>
          </div>
          <el-switch
            v-model="isEnableMac"
            active-color="#13ce66"
            inactive-text="Enable CM MAC"
            @click="(value) => updateMAC(value)"
          />
          <D3 />
        </el-card>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import D3 from './components/D3.vue';
import { mapActions, mapGetters } from 'vuex'
import { MODE, ACTION } from './../common/constants';

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
      },
      isEnableMac: false
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
    ...mapActions('pi', ['getInfoCloud', 'getV4Info', 'getReworkMode', 'doAction', 'getReworkMAC', 'postReworkMAC', 'getReworkVersion']),
    fetchData() {
      let $q = [];
      $q.push(this.getInfoCloud());
      $q.push(this.getV4Info());
      $q.push(this.getReworkMode());
      $q.push(this.getReworkMAC());
      $q.push(this.getReworkVersion());
      Promise.all($q).then(() => {
        this.initData();
      });
    },
    initData() {
      if (this.pi) {
        this.data = this.pi;
        this.isEnableMac = this.pi.isEnableMAC;
      }
    },
    updateVersion() {
      this.doAction({ action_name: ACTION.REWORK__UPGRADE_REWORK_SOURCE, num: -1}).finally(() => {
          this.getReworkVersion().finally(() => {
            this.initData();
          })
      })
    },
    updateMAC(value) {
      this.isEnableMac = value;
      this.postReworkMAC({ pi_rework_cm_mac_check: value}).finally(() => {
          this.getReworkMAC().finally(() => {
            this.initData();
          })
      })
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
  min-height: 270px;
}
</style>