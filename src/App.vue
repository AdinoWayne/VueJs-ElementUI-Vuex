<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <a
            href="https://www.humax-networks.com/"
            class="nav-link logo-left"
          >
            HUMAX NETWORKS
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
    <el-container class="wrapper">
      <el-aside
        v-if="currentUser"
        width="180px"
        style="padding: 20px 20px 0 0"
      >
        <el-tabs
          v-model="name"
          class="tabs-wrapper"
          :tab-position="'left'"
          @tab-click="switchTabs"
        >
          <el-tab-pane
            v-for="item in tabs"
            :key="item.value"
            :name="item.value"
            :label="item.text"
          />
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
        text: 'Main',
        value: 'status'
      },{
        text: 'Additional Settings',
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
        'Main': () => {
          return this.$router.push("/status");
        },
        'Additional Settings': () => {
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
  min-height: 80vh;
}
.el-tabs--left .el-tabs__header.is-left {
  width: 100%;
}
.logo-left {
  font-size: 16px;
  font-weight: bold;
  color: #fff !important;
}
.el-main.main {
  padding-left: 0;
}
.wrapper {
  height: calc(100vh - 75px);
}
</style>