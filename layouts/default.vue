<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="$auth.loggedIn"
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <div 
          v-for="(item, i) in items"
          :key="i"
          router
          exact
        >
            <!-- Authenticated -->
            <v-list-item 
            :to="item.to"
            :href="item.href"
            v-if="$auth.loggedIn && loggedIn.includes(item.title)">
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-if="item.title=='Logout'" @click="logout()"  v-text="item.title" />
                        <v-list-item-title v-else v-text="item.title" />
                    </v-list-item-content>
            </v-list-item>
            <!-- Guest -->
            <!-- <v-list-item
            :to="item.to"
            :href="item.href"
            v-if="!$auth.loggedIn && loggedOut.includes(item.title)">
                <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title v-text="item.title" />
                </v-list-item-content>
            </v-list-item> -->
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" app>
      <v-app-bar-nav-icon v-if="$auth.loggedIn" @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: true,
      drawer: true,
      loggedIn: ['Welcome', 'Dashboard', 'Logout'],
      loggedOut: [], // Add All Item if Logged Out
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/dashboard',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Logout',
          href: '#',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Login',
          to: '/login',
        },
      ],
      title: 'Kenneth Solomon',
    }
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
        console.log('logout')
      } catch (error) {
        console.log(error)  
      }
    }
  },
}
</script>
