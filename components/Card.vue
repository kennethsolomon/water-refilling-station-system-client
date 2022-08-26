<template>
  <v-card max-width="200" :color="card_data.color" class="rounded-xl mr-2">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-2 white--text">
          <v-icon color="white">{{ card_data.icon }}</v-icon>
          {{ card_data.title }}
        </div>
        <v-list-item-title class="text-h5 mb-1 white--text">
          {{ card_data.symbol }} {{ card_data.data }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  // icon, title, symbol, data
  props: {
    properties: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    card_data: {},
  }),
  created() {
    this.card_data = this.properties
  },
}
</script>

<style scoped></style>
