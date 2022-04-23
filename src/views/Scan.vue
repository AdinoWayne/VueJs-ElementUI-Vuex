<template>
  <el-container>
    <el-main>
      <el-row
        :gutter="20"
        class="class-row"
      >
        <el-col :span="12">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>HGJ310v4 GW IP used on Raspberry</span>
              <el-button
                type="success"
                size="mini"
                style="float: right"
                @click="() => handleClick(1)"
              >
                Update
              </el-button>
            </div>
            <table class="home-table">
              <tr>
                <th>HGJ310v4 GW IP</th>
                <td>
                  <el-input
                    v-model="gateway.hgj310v4_gw_ip" 
                    size="mini"
                    @change="e => onChange(e, gateway.hgj310v4_gw_ip)"
                  />
                </td>
              </tr>
            </table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>SSID and PASWORD of Rapsberry PI's WiFi Client</span>
              <el-button
                type="success"
                size="mini"
                style="float: right"
                @click="() => handleClick(2)"
              >
                Update
              </el-button>
            </div>
            <table class="home-table">
              <tr>
                <th>SSID</th>
                <td>
                  <el-input
                    v-model="wifi.ssid"
                    size="mini"
                    @change="e => onChange(e, wifi.ssid)"
                  />
                </td>
              </tr>
              <tr style="border-bottom: 0">
                <th>PASSWORD</th>
                <td>
                  <el-input
                    v-model="wifi.password"
                    size="mini"
                    show-password
                    @change="e => onChange(e, wifi.password)"
                  />
                </td>
              </tr>
            </table>
          </el-card>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        class="class-row"
      >
        <el-col :span="12">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>IP Address of all Raspberry PI's interfaces</span>
              <el-button
                type="success"
                size="mini"
                style="float: right"
                @click="handleRefresh"
              >
                Refresh
              </el-button>
            </div>
            <table class="home-table">
              <tr>
                <th>Ethernet</th><td>{{ interfaces.eth0 }}</td>
              </tr>
              <tr>
                <th>USB-to-Ethernet</th><td>{{ interfaces.usb_to_ethernet }}</td>
              </tr>
              <tr>
                <th>Wi-Fi</th><td>{{ interfaces.wifi }}</td>
              </tr>
            </table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>Open a SSH Server on HGJ310v4</span>
              <el-button
                type="success"
                size="mini"
                style="float: right"
                @click="() => handleClick(3)"
              >
                Open SSH Server
              </el-button>
            </div>
            <table class="home-table">
              <tr>
                <th>ID</th>
                <td>
                  <el-input
                    v-model="root.id"
                    size="mini"
                    @change="e => onChange(e, root.id)"
                  />
                </td>
              </tr>
              <tr>
                <th>PASSWORD</th>
                <td>
                  <el-input
                    v-model="root.password"
                    size="mini"
                    show-password
                    @change="e => onChange(e, root.password)"
                  />
                </td>
              </tr>
              <tr>
                <th>PORT</th>
                <td>
                  <el-input
                    v-model="root.port"
                    size="mini"
                    @change="e => onChange(e, root.port)"
                  />
                </td>
              </tr>
            </table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      title="Warning"
      :visible.sync="dialog"
      class="scan-dialog"
      center
    >
      <span class="dialog-message">{{ dialogMsg }}</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialog = false" type="primary">Ok</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ACTION } from './../common/constants';
import { RASPBERRY_PI_GATEWAY, RASPBERRY_PI_WIFI, RASPBERRY_PI_INTERFACE } from './../store/types/getters';
import { GET_GATEWAY_IP, GET_WIFI_ACCOUNT, GET_INTERFACE_IP, SET_PI_ACTION } from './../store/types/actions'
export default {
  name: 'Home',
  data() {
    return {
      root: {
        id: 'root',
        password: 'hmxosync',
        port: '2222'
      },
      wifi: {},
      gateway: {},
      dialogMsg: "",
      dialog: false,
      interfaces: {},
    };
  },
  computed: {
    ...mapGetters('pi', {
      RASPBERRY_PI_GATEWAY,
      RASPBERRY_PI_WIFI,
      RASPBERRY_PI_INTERFACE
    }),
  },
  created() {
  },
  mounted() {
    let $q = [];
    $q.push(this.GET_GATEWAY_IP());
    $q.push(this.GET_WIFI_ACCOUNT());
    $q.push(this.GET_INTERFACE_IP());
    Promise.all($q).finally(() => {
      this.initData();
    });
  },
  methods: {
    ...mapActions('pi', {
      GET_GATEWAY_IP,
      GET_WIFI_ACCOUNT,
      GET_INTERFACE_IP,
      SET_PI_ACTION
    }),
    initData() {
      if (this.RASPBERRY_PI_GATEWAY) {
        this.gateway = this.RASPBERRY_PI_GATEWAY
      }
      if (this.RASPBERRY_PI_WIFI) {
        this.wifi = this.RASPBERRY_PI_WIFI
      }
      if (this.RASPBERRY_PI_INTERFACE) {
        this.interfaces = this.RASPBERRY_PI_INTERFACE
      }
    },
    // eslint-disable-next-line no-unused-vars
    onChange(e, value) {
      value = e;
    },
    putGateway() {
      this.SET_PI_ACTION({
        action_name: ACTION.REWORK_SET_HGJ310V4_GW_IP,
        hgj310v4_gw_ip: this.gateway.hgj310v4_gw_ip,
        num: -1
      });
    },
    putWifi() {
      if (!this.wifi.ssid || !this.wifi.password) {
        this.dialog = true;
        this.dialogMsg = "SSID and Password can not be empty. Please check again."
        return;
      }
      this.SET_PI_ACTION({
        action_name: ACTION.REWORK_SET_RAPS_PI_WIFI_ACCOUNT,
        ssid: this.wifi.ssid,
        password: this.wifi.password,
        num: -1
      });
    },
    openSSH() {
      if (!this.root.id || !this.root.password) {
        this.dialog = true;
        this.dialogMsg = "ID and Password can not be empty. Please check again."
        return;
      }
      if (this.root.port < 1023) {
        this.dialog = true;
        this.dialogMsg = "Current port is in well known port range, Please choose another port from 1024-65535";
        return;
      }
      this.SET_PI_ACTION({
        action_name: ACTION.REWORK_SET_OPEN_SSH_SERVER_ON_V4_MANUALLY,
        id: this.root.id,
        password: this.root.password,
        port: this.root.port,
        num: -1
      }).then((data) => {
        if (data) {
          this.dialog = true;
          this.dialogMsg = data.detail || "";
        }
      }).catch(err => {
        if (err) {
          this.dialog = true;
          this.dialogMsg = err.detail || "";
        }
      })
    },
    handleRefresh() {
      let $q = [];
      $q.push(this.GET_INTERFACE_IP());
      Promise.all($q).finally(() => {
        this.initData();
      });
    },
    handleClick(type) {
      switch(type) {
        case 1:
          this.putGateway();
          break;
        case 2:
          this.putWifi();
          break;
        case 3:
          this.openSSH();
          break;
        default:
          break;
      }
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
.class-row {
  margin-bottom: 10px;
}

.class-row .el-card {
  min-height: 223px;
  display: flex;
  flex-direction: column;
}
.class-row .home-table th {
  width: 50%;
}
/* .class-row .home-table th, .class-row .home-table td {
  vertical-align: top;
} */
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
.dialog-message {
    width: 100%;
    display: block;
    text-align: center;
}
.scan-dialog .el-dialog {
  max-width: 590px;
  width: 100%;
}
</style>
