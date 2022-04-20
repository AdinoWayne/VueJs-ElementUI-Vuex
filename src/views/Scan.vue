<template>
  <el-container>
    <el-main>
      <el-row :gutter="20" class="class-row">
        <el-col :span="12">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>Raspberry PI(set/show IP)</span>
              <el-button type="success" size="mini" style="float: right"
              @click="() => handleClick(1)">Update</el-button>
            </div>
            <table class="home-table">
                <tr>
                  <th>HGJ310v4 Gateway IP</th>
                  <td>
                    <el-input size="mini" 
                    v-model="gateway.hgj310v4_gw_ip"
                    @change="e => onChange(e, gateway.hgj310v4_gw_ip)">
                    </el-input>
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
              <span>Raspberry PI(set/show SSID / PWD)</span>
              <el-button type="success" size="mini" style="float: right"
              @click="() => handleClick(2)">Update</el-button>
            </div>
              <table class="home-table">
                <tr>
                  <th>SSID on Raspberry PI's Wifi Interface</th>
                  <td>
                    <el-input size="mini" v-model="wifi.ssid"
                    @change="e => onChange(e, wifi.ssid)">
                    </el-input>
                  </td>
                </tr>
                <tr style="border-bottom: 0">
                  <th>PASSWORD on Raspberry PI's Wifi Interface</th>
                  <td>
                    <el-input size="mini" v-model="wifi.password" show-password
                    @change="e => onChange(e, wifi.password)">
                    </el-input>
                  </td>
                </tr>
              </table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="class-row">
        <el-col :span="12">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>Raspberry PI(Show IP of all interfaces)</span>
            </div>
            <table class="home-table">
              <tr>
                <th>eth0</th><td>{{ interfaces.eth0 }}</td>
              </tr>
              <tr>
                <th>USB-to-Ethernet</th><td>{{ interfaces.eth0 }}</td>
              </tr>
              <tr>
                <th>Wi-Fi</th><td>{{ interfaces.eth0 }}</td>
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
              <el-button type="success" size="mini" style="float: right"
              @click="() => handleClick(3)">Update</el-button>
            </div>
            <table class="home-table">
              <tr>
                <th>ID</th>
                <td>
                  <el-input size="mini" v-model="root.id"
                  @change="e => onChange(e, root.id)">
                  </el-input>
                </td>
              </tr>
              <tr style="border-bottom: 0">
                <th>Password</th>
                <td>
                  <el-input size="mini" v-model="root.password" show-password
                  @change="e => onChange(e, root.password)">
                  </el-input>
                </td>
              </tr>
            </table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ACTION } from './../common/constants';
export default {
  name: 'Home',
  data() {
    return {
      root: {
        id: 'root',
        password: 'hmxosync'
      },
      wifi: {},
      gateway: {},
      interfaces: {},
    };
  },
  computed: {
    ...mapGetters('pi' ,["raspberry_pi_gateway", "raspberry_pi_wifi", "raspberry_pi_interface"]),
  },
  created() {
  },
  mounted() {
    let $q = [];
    $q.push(this.getGatewayIP());
    $q.push(this.getWifiAccount());
    $q.push(this.getInterfaceIP());
    Promise.all($q).finally(() => {
      this.initData();
    });
  },
  methods: {
    ...mapActions('pi', [
      'getGatewayIP',
      'getWifiAccount',
      'getInterfaceIP',
      'doAction'
    ]),
    initData() {
      if (this.raspberry_pi_gateway) {
        this.gateway = this.raspberry_pi_gateway
      }
      if (this.raspberry_pi_wifi) {
        this.wifi = this.raspberry_pi_wifi
      }
      if (this.raspberry_pi_interface) {
        this.interfaces = this.raspberry_pi_interface
      }
    },
    onChange(e, value) {
      value = e;
    },
    putGateway() {
      this.doAction({
        action_name: ACTION.REWORK_SET_HGJ310V4_GW_IP,
        hgj310v4_gw_ip: this.gateway.hgj310v4_gw_ip,
        num: -1
      });
    },
    putWifi() {
      this.doAction({
        action_name: ACTION.REWORK_SET_RAPS_PI_WIFI_ACCOUNT,
        ssid: this.wifi.ssid,
        password: this.wifi.password,
        num: -1
      });
    },
    openSSH() {
      this.doAction({
        action_name: ACTION.REWORK_SET_OPEN_SSH_SERVER_ON_V4_MANUALLY,
        id: this.root.id,
        password: this.root.password,
        num: -1
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
.class-row .home-table th, .class-row .home-table td {
  vertical-align: top;
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