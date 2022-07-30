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
          text: 'Something went wrong.',
          timeout: 2000,
          color: 'error',
        },
      })
    },
  },
}
</script>

<style scoped></style>
