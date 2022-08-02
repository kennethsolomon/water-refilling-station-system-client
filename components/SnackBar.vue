<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar.status"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      top
      right
      elevation="2"
      multi-line
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="unSetSnackbar"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({}),
  computed: {
    ...mapGetters({
      snackbar: 'getSnackbar',
    }),
  },

  methods: {
    showSnackbar() {
      this.$store.commit('SET_SNACKBAR', {
        snackbar: {
          status: true,
          text: 'Show snackbar successfully!',
          timeout: 2000,
          color: 'success',
        },
      })
    },
    unSetSnackbar() {
      this.$store.commit('SET_SNACKBAR', {
        snackbar: {
          status: false,
          color: this.snackbar.color,
          text: this.snackbar.text,
        },
      })
    },
  },
}
</script>

<style scoped></style>
