<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col
          :span="8"
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
                Progress: <span>{{ loadData(data.cloud.curr_state) }}</span>
              </div>
              <div class="text item">
                Status: <span>{{ data.cloud.cloud_connected ? 'Connection' : 'Disconnection' }}</span>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col
          :span="6"
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
            </el-card>
          </div>
        </el-col>
        <el-col
          :span="10"
          class="card-content"
        >
          <div class="grid-content bg-purple">
            <el-card class="box-card card-information">
              <div
                slot="header"
                class="clearfix"
              >
                <span>Rework Information</span>
              </div>
              <div class="text item flex">
                <span class="item-label"> Current Version: </span><span
                  v-if="data.version && data.version.pi_rework_current_ver"
                  class="margin__right-10"
                >{{ loadData(data.version.pi_rework_current_ver) }}</span>
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="data.version && data.version.pi_rework_latest_ver == data.version.pi_rework_current_ver"
                  @click="centerDialogVisible = true"
                >
                  Update
                </el-button>
              </div>
              <div class="text item">
                <span class="item-label"> Latest Version: </span><span v-if="data.version && data.version.pi_rework_current_ver">{{ loadData(data.version.pi_rework_latest_ver) }}</span>
              </div>
              <div class="text item flex">
                <div class="item-label">
                  Rework Mode:
                </div>
                <el-switch

                  v-model="pi_rework_mode"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#409eff"
                  active-text="Auto"
                  inactive-text="Manual"
                  @change="handleMode"
                />
              </div>
              <div
                class="text item flex"
                style="align-items: center;"
              >
                <span class="item-label margin__right-10"> Verifying CM MAC when installing Plume Certificates: </span>
                <el-switch
                  v-model="isEnableMac"
                  active-color="#13ce66"
                  @change="(value) => updateMAC(value)"
                />
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
          <D3 />
        </el-card>
      </el-container>
    </el-main>
    <el-dialog
      title="Warning"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>Update Version could affect to operation, are you sure ?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import D3 from './components/D3.vue';
import { mapActions, mapGetters } from 'vuex'
import { MODE, ACTION, CLOUD } from './../common/constants';

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
        version: {},
      },
      pi_rework_mode: null,
      centerDialogVisible: false,
      isEnableMac: null
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
    ...mapActions('pi', [
      'getInfoCloud',
      'getV4Info',
      'getReworkMode',
      'doAction',
      'getReworkMAC',
      'postReworkMAC',
      'getReworkVersion'
    ]),
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
    handleMode(value) {
      var param = "";
      if (value) {
        param = MODE.REWORK__ALL_AUTO;
      } else {
        param = MODE.REWORK__ALL_MANUAL;
      }
      this.doAction({ action_name: param, num: -1}).finally(() => {
          this.getReworkMode().finally(() => {
            this.initData();
          })
      })
    },
    initData() {
      if (this.pi) {
        this.data = this.pi;
        if (this.isEnableMac !== null || this.isEnableMac !== undefined) {
          this.isEnableMac = this.pi.isEnableMAC;
        }
        console.log(this.pi);
        if (this.pi.pi_rework_mode) {
          this.pi_rework_mode = this.pi.pi_rework_mode.indexOf(MODE.REWORK__ALL_AUTO) !== -1 ? true : false;
        }
      }
    },
    updateVersion() {
      this.doAction({ action_name: ACTION.REWORK__UPGRADE_REWORK_SOURCE, num: -1}).finally(() => {
          this.getReworkVersion().finally(() => {
            this.initData();
          })
      })
    },
    handleConfirm() {
      this.centerDialogVisible = false;
      this.updateVersion();
    },
    loadData(data) {
      if (!data) {
        return ''
      }
      switch (true) {
          case data.indexOf(CLOUD.REWORK__CHECKING_FW_VER_WITH_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__CHECKING_FW_VER_WITH_CLOUD.TEXT;
          case data.indexOf(CLOUD.REWORK__FAIL_CHECKING_FW_VER_WITH_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_CHECKING_FW_VER_WITH_CLOUD.TEXT;
          case data.indexOf(CLOUD.REWORK__SUCCESS_CHECKING_FW_VER_WITH_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_CHECKING_FW_VER_WITH_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__DOWNLOAD_FW_FROM_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__DOWNLOAD_FW_FROM_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__FAIL_DOWNLOAD_FW_FROM_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_DOWNLOAD_FW_FROM_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__SUCCESS_DOWNLOAD_FW_FROM_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_DOWNLOAD_FW_FROM_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__NONE.VALUE) !== -1:
              return CLOUD.REWORK__NONE.TEXT
          case data.indexOf(CLOUD.REWORK__ALL_AUTO.VALUE) !== -1:
              return CLOUD.REWORK__ALL_AUTO.TEXT
          case data.indexOf(CLOUD.REWORK__ALL_MANUAL.VALUE) !== -1:
              return CLOUD.REWORK__ALL_MANUAL.TEXT
          case data.indexOf(CLOUD.REWORK__SCANNING.VALUE) !== -1:
              return CLOUD.REWORK__SCANNING.TEXT
          case data.indexOf(CLOUD.REWORK__FAIL_SCANNING.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_SCANNING.TEXT
          case data.indexOf(CLOUD.REWORK__SUCCESS_SCANNING.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_SCANNING.TEXT
          case data.indexOf(CLOUD.REWORK__SENDING_V4_INFO_TO_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__SENDING_V4_INFO_TO_CLOUD.TEXT
          case data.indexOf(CLOUD.REWOWK__FAIL_SENDING_V4_INFO_TO_CLOUD.VALUE) !== -1:
              return CLOUD.REWOWK__FAIL_SENDING_V4_INFO_TO_CLOUD.TEXT
          case data.indexOf(CLOUD.REWOWK__SUCCESS_SENDING_V4_INFO_TO_CLOUD.VALUE) !== -1:
              return CLOUD.REWOWK__SUCCESS_SENDING_V4_INFO_TO_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__DONWLOADING_PLUME_CAS_FROM_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__DONWLOADING_PLUME_CAS_FROM_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__FAIL_DONWLOADING_PLUME_CAS_FROM_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_DONWLOADING_PLUME_CAS_FROM_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__SUCCESS_DONWLOADING_PLUME_CAS_FROM_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_DONWLOADING_PLUME_CAS_FROM_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__OPENNING_SSH_SERVER_ON_V4.VALUE) !== -1:
              return CLOUD.REWORK__OPENNING_SSH_SERVER_ON_V4.TEXT
          case data.indexOf(CLOUD.REWORK__FAIL_OPENNING_SSH_SERVER_ON_V4.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_OPENNING_SSH_SERVER_ON_V4.TEXT
          case data.indexOf(CLOUD.REWORK__SUCCESS_OPENNING_SSH_SERVER_ON_V4.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_OPENNING_SSH_SERVER_ON_V4.TEXT
          case data.indexOf(CLOUD.REWORK__SENDING_FW_TO_V4.VALUE) !== -1:
              return CLOUD.REWORK__SENDING_FW_TO_V4.TEXT
          case data.indexOf(CLOUD.REWORK__FAIL_SENDING_FW_TO_V4.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_SENDING_FW_TO_V4.TEXT
          case data.indexOf(CLOUD.REWORK__SUCCESS_SENDING_FW_TO_V4.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_SENDING_FW_TO_V4.TEXT
          case data.indexOf(CLOUD.REWORK__SENDING_PLUME_CAS_TO_V4.VALUE) !== -1:
              return CLOUD.REWORK__SENDING_PLUME_CAS_TO_V4.TEXT
          case data.indexOf(CLOUD.REWORK__FAIL_SENDING_PLUME_CAS_TO_V4.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_SENDING_PLUME_CAS_TO_V4.TEXT
          case data.indexOf(CLOUD.REWORK__SUCCESS_SENDING_PLUME_CAS_TO_V4.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_SENDING_PLUME_CAS_TO_V4.TEXT
          case data.indexOf(CLOUD.REWORK__INSTALLING_PLUME_CAS_ON_V4.VALUE) !== -1:
              return CLOUD.REWORK__INSTALLING_PLUME_CAS_ON_V4.TEXT
          case data.indexOf(CLOUD.REWORK__FAIL_INSTALLING_PLUME_CAS_ON_V4.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_INSTALLING_PLUME_CAS_ON_V4.TEXT
          case data.indexOf(CLOUD.REWORK__SUCCESS_INSTALLING_PLUME_CAS_ON_V4.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_INSTALLING_PLUME_CAS_ON_V4.TEXT
          case data.indexOf(CLOUD.REWORK__INSTALLING_FW_FOR_V4.VALUE) !== -1:
              return CLOUD.REWORK__INSTALLING_FW_FOR_V4.TEXT
          case data.indexOf(CLOUD.REWORK__FAIL_INSTALLING_FW_FOR_V4.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_INSTALLING_FW_FOR_V4.TEXT
          case data.indexOf(CLOUD.REWORK__SUCCESS_INSTALLING_FW_FOR_V4.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_INSTALLING_FW_FOR_V4.TEXT
          case data.indexOf(CLOUD.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__FAIL_SENDING_UPGRADED_LOG_TO_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__FAIL_SENDING_UPGRADED_LOG_TO_CLOUD.TEXT
          case data.indexOf(CLOUD.REWORK__SUCCESS_SENDING_UPGRADED_LOG_TO_CLOUD.VALUE) !== -1:
              return CLOUD.REWORK__SUCCESS_SENDING_UPGRADED_LOG_TO_CLOUD.TEXT
          default:
              return data;
        }
    },
    updateMAC(value) {
      this.isEnableMac = value;
      if (this.isEnableMac == null || this.isEnableMac == undefined) {
        return;
      }
      this.postReworkMAC({ pi_rework_cm_mac_check: value}).finally(() => {
          this.getReworkMAC().finally(() => {
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

.margin__right-10 {
  margin-right: 10px;
}
.flex {
  display: flex;
}

.item {
  margin-bottom: 18px;
  min-height: 28px;
  line-height: 28px;
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
  min-height: 290px;
}
.item-label {
  min-width: 100px;
  display: inline-block;
}
</style>