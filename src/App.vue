<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link
            to="/"
            class="nav-link"
          >
            HUMAX
          </router-link>
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
          <router-link
            to="/profile"
            class="nav-link"
          >
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
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
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: ['Status', 'Scan', 'Upgrade'],
      name: 'Status'
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
    // eslint-disable-next-line no-unused-vars
    switchTabs(tab, _event) {
      var switchObject = {
        'Status': () => {
          return this.$router.push("/status");
        },
        'Scan': () => {
          return this.$router.push("/scan");
        },
        'Upgrade': () => {
          return this.$router.push("/upgrade");
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
  height: 80vh;
}
.el-tabs--left .el-tabs__header.is-left {
  width: 200px;
}
</style>