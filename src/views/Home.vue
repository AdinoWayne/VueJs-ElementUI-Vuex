<template>
  <el-container>
    <el-main class="child-main">
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
                      :disabled="isDisabledVersion(data.version)"
                      :class="(isDisabledVersion(data.version))?'btn-disable':'btn-update'"
                      @click="centerDialogVisible = true"
                    >
                      <span v-if="!isDisabledVersion(data.version)">Update to {{ data.version.pi_rework_latest_ver }}</span>
                      <span v-else>Already up to date</span>
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
                <tr v-if="currentUser && currentUser.user && currentUser.user.username !== ADMIN">
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
                <tr v-if="currentUser && currentUser.user && currentUser.user.username !== ADMIN">
                  <th>Skip Installing Plume CAs</th><td>
                    <el-switch
                      key="key"
                      v-model="skip_install_plume"
                      style="display: block"
                      active-color="#13ce66"
                      active-text="Enable"
                      inactive-text="Disable"
                      @click.native="(e) => handleSkip(1, e)"
                    />
                  </td>
                </tr>
                <tr v-if="currentUser && currentUser.user && currentUser.user.username !== ADMIN">
                  <th>Skip Installing Firmware</th><td>
                    <el-switch
                      key="key"
                      v-model="skip_install_fw"
                      style="display: block"
                      active-color="#13ce66"
                      active-text="Enable"
                      inactive-text="Disable"
                      @click.native="(e) => handleSkip(2, e)"
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
          <div v-if="currentUser && currentUser.user && currentUser.user.username === ADMIN">
            <LittleD3
              :open-progress-dialog="openProgressDialog"
              :set-step-home="handleSetStep"
            />
          </div>
          <div v-else>
            <D3
              :open-progress-dialog="openProgressDialog"
              :set-step-home="handleSetStep"
            />
          </div>
        </el-card>
      </el-container>
    </el-main>
    <el-dialog
      title="Warning"
      :visible.sync="centerDialogVisible"
      class="home-dialog"
      center
    >
      <span class="dialog-message">Update could affect to current progress. Choose confirm to continue?</span>
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
      class="home-dialog"
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
    <el-dialog
      title="Warning"
      :visible.sync="dialogSkip"
      class="home-dialog"
      center
    >
      <span class="dialog-message">Skip installing both Plume Certificates and Firmware are not allowed</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogSkip = false">OK</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Warning"
      :visible.sync="dialogProgress"
      class="home-dialog"
      center
    >
      <span class="dialog-message">
        Requested Action is disallowed because No Connection to or in Checking Firmware with HMX Cloud. Please wait for seconds ...
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogProgress = false">OK</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="objDialog.title"
      :visible.sync="objDialog.open"
      class="home-dialog"
      center
    >
      <span class="dialog-message">
        {{ objDialog.msg }}
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="objDialog.open = false">OK</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import D3 from './components/D3.vue';
import LittleD3 from './components/LittleD3.vue';
import { mapActions, mapGetters } from 'vuex'
import { MODE, ACTION, CLOUD } from './../common/constants';
import { compareVersionNumbers } from './../common/utils';
import {
  GET_INFO_CLOUD,
  GET_INFO_V4,
  GET_REWORK_MODE,
  SET_PI_ACTION,
  GET_REWORK_MAC,
  SET_REWORK_MAC,
  GET_REWORK_VERSION,
  GET_SKIP_PLUME_CAS,
  GET_SKIP_INSTALL_FW
} from './../store/types/actions';
import { HOME_PI } from './../store/types/getters';

export default {
  name: 'Home',
  components: {
    D3,
    LittleD3
  },
  data() {
    return {
      data: {
        cloud: {},
        v4: {},
        version: {},
      },
      pi_rework_mode: null,
      skip_install_plume: false,
      skip_install_fw: false,
      centerDialogVisible: false,
      dialogRestart: false,
      dialogSkip: false,
      dialogProgress: false,
      objDialog: {
        msg: '',
        open: false,
        title: ''
      },
      stepAb: 0,
      isEnableMac: null,
      isLoading: false,
      timer: null,
      key: 0,
    };
  },
  computed: {
    ...mapGetters('pi', {HOME_PI}),
    MODE() {
      return MODE;
    },
    ROOT() {
      return 'root';
    },
    ADMIN() {
      return 'admin';
    },
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {},
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    ...mapActions('pi',{
      GET_INFO_CLOUD,
      GET_INFO_V4,
      GET_REWORK_MODE,
      SET_PI_ACTION,
      GET_REWORK_MAC,
      SET_REWORK_MAC,
      GET_REWORK_VERSION,
      GET_SKIP_PLUME_CAS,
      GET_SKIP_INSTALL_FW
    }),
    fetchData() {
      let $q = [];
      $q.push(this.GET_INFO_CLOUD({}));
      $q.push(this.GET_INFO_V4());
      $q.push(this.GET_REWORK_MODE());
      $q.push(this.GET_REWORK_MAC());
      $q.push(this.GET_REWORK_VERSION());
      $q.push(this.GET_SKIP_PLUME_CAS());
      $q.push(this.GET_SKIP_INSTALL_FW());
      if (this.key == 0) {
        this.key = 1;
      } 
      Promise.all($q).finally(() => {
        this.initData();
      });
    },
    openProgressDialog() {
      this.dialogProgress = true;
    },
    handleMode(value) {
      var param = "";
      if (value) {
        param = MODE.REWORK__ALL_AUTO;
      } else {
        param = MODE.REWORK__ALL_MANUAL;
      }
      this.SET_PI_ACTION({ action_name: param, num: -1}).finally(() => {
          this.GET_REWORK_MODE().finally(() => {
            this.initData();
          })
      })
    },
    initData() {
      if (this.HOME_PI) {
        this.data = this.HOME_PI;
        if (this.isEnableMac !== null || this.isEnableMac !== undefined) {
          this.isEnableMac = this.HOME_PI.pi_rework_cm_mac_check == 'enable' ? true : false;
        }
        if (this.HOME_PI.pi_rework_mode) {
          this.pi_rework_mode = this.HOME_PI.pi_rework_mode.indexOf(MODE.REWORK__ALL_AUTO) !== -1 ? true : false;
        }
        if (this.HOME_PI.skip_installing_plume_cas) {
          this.skip_install_plume = this.HOME_PI.skip_installing_plume_cas == 'enable' ? true : false;
        }
        if (this.HOME_PI.skip_installing_fw) {
          this.skip_install_fw = this.HOME_PI.skip_installing_fw == 'enable' ? true : false;
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
      this.SET_PI_ACTION({ action_name: ACTION.REWORK__RESTART, num: -1}).finally(() => {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
    },
    updateVersion() {
      this.isLoading = true;
      this.SET_PI_ACTION({ action_name: ACTION.REWORK__UPGRADE_PI_SOURCE, num: -1}).then(() => {
          this.isLoading = false;
          this.centerDialogVisible = false;
          this.dialogRestart = true;
      }).catch(() => {
        this.isLoading = false;
        this.centerDialogVisible = false;
        this.objDialog = {
          open: true,
          title: 'Warning',
          msg: 'Update failed'
        }
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
      this.SET_PI_ACTION({ action_name: data}).finally(() => {
          this.GET_REWORK_MAC().finally(() => {
            this.initData();
          })
      })
    },
    handleSetStep(value) {
      this.stepAb = value;
    },
    handleStep(key, e, value) {
      if (key == 1) {
        if (value) {
          return false;
        } else {
          if (this.stepAb > 6 || this.stepAb == 0) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        if (this.stepAb == 7) {
          return true;
        } else {
          return false;
        }
      }
    },
    handleSkip(key, e) {
      if (this.skip_install_plume && this.skip_install_fw) {
        this.dialogSkip = true;
        if (key == 1) {
          this.skip_install_plume = false;
        } else if (key == 2) {
          this.skip_install_fw = false;
        }
        e.preventDefault();
        return;
      }
      const value = key == 1 ? this.skip_install_plume : this.skip_install_fw;
      let status = value ? 'enable' : 'disable';
      const isReturn = this.handleStep(key, e, value)
      if (isReturn) {
        this.objDialog = {
          open: true,
          title: 'Warning',
          msg: 'Can not change the State, Because Rework is in progress. Back to Scan to change State'
        }
        return;
      }
      switch (key) {
        case 1:
          this.SET_PI_ACTION({
            skip_installing_plume_cas: status,
            action_name: ACTION.REWORK_SET_SKIP_INSTALLING_PLUME_CAS
          })
          break;
        case 2:
          this.SET_PI_ACTION({
            skip_installing_fw: status,
            action_name: ACTION.REWORK_SET_SKIP_INSTALLING_FW
          })
          break;
        default:
          break;
      }
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
@-webkit-keyframes my2 {
    0% {
      box-shadow:
        0 0 5px #b3e19d,
        0 0 10px #b3e19d
    } 
    50% {
      box-shadow: none;
    } 
    100% {
      box-shadow:
        0 0 5px #b3e19d,
        0 0 10px #b3e19d
    }
 }
 @-moz-keyframes my2 {
    0% {
      box-shadow:
        0 0 5px #b3e19d,
        0 0 10px #b3e19d,
        0 0 20px #b3e19d
    } 
    50% {
      box-shadow: none;
    } 
    100% {
      box-shadow:
        0 0 5px #b3e19d,
        0 0 10px #b3e19d,
        0 0 20px #b3e19d
    }
 }
 @-o-keyframes my2 { 
    0% {
      box-shadow:
        0 0 5px #b3e19d,
        0 0 10px #b3e19d,
        0 0 20px #b3e19d
    } 
    50% {
      box-shadow: none;
    } 
    100% {
      box-shadow:
        0 0 5px #b3e19d,
        0 0 10px #b3e19d,
        0 0 20px #b3e19d
    }
 }
 @keyframes my2 { 
    0% {
      box-shadow:
        0 0 5px #b3e19d,
        0 0 10px #b3e19d,
        0 0 20px #b3e19d
    } 
    50% {
      box-shadow: none;
    } 
    100% {
      box-shadow:
        0 0 5px #b3e19d,
        0 0 10px #b3e19d,
        0 0 20px #b3e19d
    }
}

.btn-update {
  background-color: #13ce66 !important;
  border-color: #13ce66 !important;
    -webkit-animation: my2 1000ms infinite;
    -moz-animation: my2 1000ms infinite; 
    -o-animation: my2 1000ms infinite; 
    animation: my2 1000ms infinite;
}
.home-table th {
  padding: 5px;
  min-width: 80px;
  font-weight: 400;
  border-right: 1px solid #eee;
}
.home-table tr {
  border-bottom: 1px solid #eee;
}
.home-table tr:last-child {
  border: none;
}
.home-table td {
  min-width: 165px;
  word-break: break-word;
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
  min-height: 329px;
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
    0% {
      color: #e74c3c;
      text-shadow:
        0 0 5px #fbb5ae,
        0 0 10px #ff8477
    } 
    50% {
      color: #222;
      text-shadow: none;
    } 
    100% {
      color: #e74c3c;
      text-shadow:
        0 0 5px #fbb5ae,
        0 0 10px #ff8477
    }
 }
 @-moz-keyframes my { 
    0% {
      color: #e74c3c;
      text-shadow:
        0 0 5px #fbb5ae,
        0 0 10px #ff8477
    } 
    50% {
      color: #222;
      text-shadow: none;
    } 
    100% {
      color: #e74c3c;
      text-shadow:
        0 0 5px #fbb5ae,
        0 0 10px #ff8477
    }
 }
 @-o-keyframes my { 
    0% {
      color: #e74c3c;
      text-shadow:
        0 0 5px #fbb5ae,
        0 0 10px #ff8477
    } 
    50% {
      color: #222;
      text-shadow: none;
    } 
    100% {
      color: #e74c3c;
      text-shadow:
        0 0 5px #fbb5ae,
        0 0 10px #ff8477
    }
 }
 @keyframes my { 
    0% {
      color: #e74c3c;
      text-shadow:
        0 0 5px #fbb5ae,
        0 0 10px #ff8477
    } 
    50% {
      color: #222;
      text-shadow: none;
    } 
    100% {
      color: #e74c3c;
      text-shadow:
        0 0 5px #fbb5ae,
        0 0 10px #ff8477
    }
}
.test {
    font-weight: bold;
    -webkit-animation: my 1000ms infinite;
    -moz-animation: my 1000ms infinite; 
    -o-animation: my 1000ms infinite; 
    animation: my 1000ms infinite;
}
.dialog-message {
    width: 100%;
    display: block;
    font-size: 14px;
    text-align: center;
    word-break: break-work;
}
.child-main, .child-main .card-content:last-child, .child-main .card-content:first-child {
  padding: 0 !important;
}
.child-main > .el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.home-dialog .el-dialog {
  width: 30%;
  min-width: 546px;
}
.btn-disable {
  background-color: #E8E9EB !important;
  border-color: #E8E9EB !important;
  color: #000 !important
}
</style>
