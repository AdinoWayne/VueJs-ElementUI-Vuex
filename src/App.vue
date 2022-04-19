<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <a
            href="https://www.humax-networks.com/"
            class="nav-link logo-left"
          >
            HUMAX NETWORK
          </a>
        </li>
      </div>
      <div
        v-if="!currentUser"
        class="navbar-nav ml-auto"
      >
        <li class="nav-item">
          <router-link
            to="/login"
            class="nav-link"
          >
            <font-awesome-icon icon="sign-in-alt" /> Login
          </router-link>
        </li>
      </div>

      <div
        v-if="currentUser"
        class="navbar-nav ml-auto"
      >
        <li class="nav-item">
          <a
            class="nav-link"
            href
            @click.prevent="logOut"
          >
            <font-awesome-icon icon="sign-out-alt" /> LogOut
          </a>
        </li>
      </div>
    </nav>
    <el-container>
      <el-aside width="160px" style="padding: 20px">
        <el-tabs class="tabs-wrapper" v-model="name" :tab-position="'left'" @tab-click="switchTabs">
          <el-tab-pane :name="item.value" :label="item.text" v-for="item in tabs" :key="item.value">
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [{
        text: 'Rework',
        value: 'status'
      },{
        text: 'Raspberry Pi',
        value: 'pi'
      }],
      name: 'Rework',
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    this.name = this.$route.name;
  },
  methods: {
    switchTabs(tab) {
      var switchObject = {
        'Rework': () => {
          return this.$router.push("/status");
        },
        'Raspberry Pi': () => {
          return this.$router.push("/pi");
        },
        'default': () => {
          return this.$router.push("/status");
        }
      };
      return (switchObject[tab.label] || switchObject['default'])();
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>
<style>
.container {
	margin-top: 20px;
}
.tabs-wrapper {
  height: 100%;
}
.el-tabs--left .el-tabs__header.is-left {
  width: 120px;
}
.logo-left {
  font-size: 16px;
  font-weight: bold;
  color: #fff !important;
}
.el-main.main {
  padding-left: 0;
}
</style>