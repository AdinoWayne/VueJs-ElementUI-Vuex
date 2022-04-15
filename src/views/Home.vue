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
              <table class="home-table">
                <tr>
                  <th>FW Name</th><td>{{ data.cloud.fw_name }}</td>
                </tr>
                <tr>
                  <th>Current State</th><td>
                    <span
                      v-if="isFocus(data.cloud.curr_state)"
                      class="test"
                    >{{ loadData(data.cloud.curr_state) }}</span><span
                      v-else
                    >{{ loadData(data.cloud.curr_state) }}</span>
                  </td>
                </tr>
                <tr>
                  <th>Connection Status</th><td>
                    <span v-if="data.cloud.cloud_connected === 'True'">Connected</span><span
                      v-else
                      class="test"
                    >Disconnected</span>
                  </td>
                </tr>
              </table>
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
              <table class="home-table">
                <tr>
                  <th>FW Version</th><td>{{ data.v4.fw_ver }}</td>
                </tr>
                <tr>
                  <th>CM MAC</th><td>{{ data.v4.cm_mac }}</td>
                </tr>
                <tr>
                  <th>Serial Number</th><td>{{ data.v4.sn_num }}</td>
                </tr>
              </table>
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
              <table class="home-table">
                <tr>
                  <th>Current Pi Code Version</th><td>
                    <span
                      v-if="data.version && data.version.pi_rework_current_ver"
                      class="margin__right-10"
                    >{{ loadData(data.version.pi_rework_current_ver) }}</span>
                    <el-button
                      size="mini"
                      type="success"
                      class="btn-update"
                      :disabled="isDisabledVersion(data.version)"
                      @click="centerDialogVisible = true"
                    >
                      Update <span v-if="!isDisabledVersion(data.version)">to {{ data.version.pi_rework_latest_ver }}</span>
                    </el-button>
                  </td>
                </tr>
                <tr>
                  <th>Rework Run Mode</th><td>
                    <el-switch
                      v-model="pi_rework_mode"
                      style="display: block"
                      active-color="#13ce66"
                      active-text="Auto"
                      inactive-text="Manual"
                      @change="handleMode"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Verifying CM MAC when installing Plume Certificates</th><td>
                    <el-switch
                      v-model="isEnableMac"
                      active-color="#13ce66"
                      active-text="Enable"
                      inactive-text="Disable"
                      @change="(value) => updateMAC(value)"
                    />
                  </td>
                </tr>
              </table>
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
      <span class="dialog-message">Update Version could affect to operation, are you sure?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button
          type="primary"
          :loading="isLoading"
          @click="handleConfirm"
        >Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Warning"
      :visible.sync="dialogRestart"
      :show-close="false"
      :close-on-click-modal="false"
      width="30%"
      center
    >
      <span class="dialog-message">Update completed, Do you want to restart?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :loading="isLoading"
          @click="handleRestart"
        >Restart</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import D3 from './components/D3.vue';
import { mapActions, mapGetters } from 'vuex'
import { MODE, ACTION, CLOUD } from './../common/constants';
import { compareVersionNumbers } from './../common/utils';

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
      dialogRestart: false,
      isEnableMac: null,
      isLoading: false,
      timer: null,
    };
  },
  computed: {
    ...mapGetters('pi' ,["pi"]),
    MODE() {
      return MODE;
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {},
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
      Promise.all($q).finally(() => {
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
          this.isEnableMac = this.pi.pi_rework_cm_mac_check == 'enable' ? true : false;
        }
        if (this.pi.pi_rework_mode) {
          this.pi_rework_mode = this.pi.pi_rework_mode.indexOf(MODE.REWORK__ALL_AUTO) !== -1 ? true : false;
        }
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.fetchData();
      }, 2000);
    },
    handleRestart() {
      this.isLoading = true;
      this.doAction({ action_name: ACTION.REWORK__RESTART, num: -1}).finally(() => {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
    },
    updateVersion() {
      this.isLoading = true;
      this.doAction({ action_name: ACTION.REWORK__UPGRADE_PI_SOURCE, num: -1}).then(() => {
          this.isLoading = false;
          this.centerDialogVisible = false;
          this.dialogRestart = true;
          // this.getReworkVersion().finally(() => {
          //   this.initData();
          // })
      })
    },
    handleConfirm() {
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
    isFocus(value) {
      if (!value) {
        return false
      }
      switch (true) {
        case value.indexOf(CLOUD.REWORK__CHECKING_FW_VER_WITH_CLOUD.VALUE) !== -1:
            return true;
        case value.indexOf(CLOUD.REWORK__FAIL_CHECKING_FW_VER_WITH_CLOUD.VALUE) !== -1:
            return true;
        case value.indexOf(CLOUD.REWORK__DOWNLOAD_FW_FROM_CLOUD.VALUE) !== -1:
            return true;
        case value.indexOf(CLOUD.REWORK__FAIL_DOWNLOAD_FW_FROM_CLOUD.VALUE) !== -1:
            return true;
        default:
          return false;
      }
    },
    isDisabledVersion(value) {
      if (!value) {
        return true;
      }
      if (!value.pi_rework_latest_ver || !value.pi_rework_current_ver) {
        return true;
      }
      return !(compareVersionNumbers(value.pi_rework_latest_ver, value.pi_rework_current_ver) > 0)
    },
    updateMAC(value) {
      this.isEnableMac = value;
      if (this.isEnableMac == null || this.isEnableMac == undefined) {
        return;
      }
      let data = ""
      if (value) {
        data = "REWORK__CM_MAC_CHECK_ENABLE";
      } else {
        data = "REWORK__CM_MAC_CHECK_DISABLE";
      }
      this.doAction({ action_name: data}).finally(() => {
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
.el-card__header span {
  font-weight: bold;
}
.home-table {
  width: 100%;
  flex: 1;
}
.btn-update {
  background-color: #13ce66 !important;
  border-color: #13ce66 !important;
}
.home-table th {
  padding: 5px;
  min-width: 80px;
  font-weight: 400;
  border-right: 1px solid #eee;
}
.home-table tr:nth-child(2) {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.home-table td {
  min-width: 150px;
  padding: 5px;
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
  display: flex;
  flex-direction: column;
}
.el-card .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.item-label {
  min-width: 100px;
  display: inline-block;
}

@-webkit-keyframes my {
    0% { color: #e74c3c; font-size: 15px;} 
    50% { color: #222;; font-size: 14px;} 
    100% { color: #e74c3c; font-size: 15px;} 
 }
 @-moz-keyframes my { 
    0% { color: #e74c3c; font-size: 15px;} 
    50% { color: #222;; font-size: 14px;} 
    100% { color: #e74c3c; font-size: 15px;} 
 }
 @-o-keyframes my { 
    0% { color: #e74c3c; font-size: 15px;} 
    50% { color: #222;; font-size: 14px;} 
    100% { color: #e74c3c; font-size: 15px;} 
 }
 @keyframes my { 
    0% { color: #e74c3c; font-size: 15px;} 
    50% { color: #222;; font-size: 14px;} 
    100% { color: #e74c3c; font-size: 15px;} 
} 
.test {
    font-weight: bold;
    -webkit-animation: my 700ms infinite;
    -moz-animation: my 700ms infinite; 
    -o-animation: my 700ms infinite; 
    animation: my 700ms infinite;
}
.dialog-message {
    width: 100%;
    display: block;
    text-align: center;
}
</style>
