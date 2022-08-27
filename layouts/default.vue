<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="$auth.loggedIn"
      v-model="drawer"
      :clipped="clipped"
      app
    >
      <v-list>
        <div v-for="(item, i) in items" :key="i" router exact>
          <!-- Authenticated -->
          <v-list-item
            v-if="$auth.loggedIn && loggedIn.includes(item.title)"
            :to="item.to"
            :href="item.href"
          >
            <v-list-item-action>
              <v-icon v-if="item.title == 'Logout'" @click="logout()">{{
                item.icon
              }}</v-icon>
              <v-icon v-else>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                v-if="item.title == 'Logout'"
                @click="logout()"
                v-text="item.title"
              />
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
      <v-app-bar-nav-icon
        v-if="$auth.loggedIn"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  middleware: 'load-customers-employees-and-items',
  name: 'DefaultLayout',
  data() {
    return {
      clipped: true,
      drawer: true,
      loggedIn: ['Welcome', 'Dashboard', 'Logout', 'Customers', 'Delivery'],
      // loggedOut: [], // Add All Item if Logged Out
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'Customers',
          to: '/customers',
        },
        {
          icon: 'mdi-car-lifted-pickup',
          title: 'Delivery',
          to: '/deliveries',
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
      title: 'Solomon Water Refilling Station',
    }
  },

  mounted() {},

  methods: {
    async logout() {
      try {
        await this.$auth.logout()
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
