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
              <el-button type="success" size="mini" style="float: right">Update</el-button>
            </div>
            <table class="home-table">
                <tr>
                  <th>HGJ310v4 Gateway IP</th><td><el-input size="mini" v-model="input"></el-input></td>
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
              <el-button type="success" size="mini" style="float: right">Update</el-button>
            </div>
              <table class="home-table">
                <tr>
                  <th>SSID on Raspberry PI's Wifi Interface</th><td><el-input size="mini" v-model="input"></el-input></td>
                </tr>
                <tr style="border-bottom: 0">
                  <th>PASSWORD on Raspberry PI's Wifi Interface</th><td><el-input size="mini" v-model="input" show-password></el-input></td>
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
              <el-button type="success" size="mini" style="float: right">Update</el-button>
            </div>
            <table class="home-table">
              <tr>
                <th>ID</th><td><el-input size="mini" v-model="data.root.id"></el-input></td>
              </tr>
              <tr style="border-bottom: 0">
                <th>Password</th><td><el-input size="mini" v-model="data.root.password" show-password></el-input></td>
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

export default {
  name: 'Home',
  data() {
    return {
      data: {
        root: {
          id: 'root',
          password: 'hmxosync'
        }
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
    $q.push(this.raspberry_pi_gateway());
    $q.push(this.raspberry_pi_wifi());
    $q.push(this.raspberry_pi_interface());
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