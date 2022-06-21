<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="py-4">
        <v-card-title class="headline">
            Public Home Page
        </v-card-title>
        <v-card-text>
            Welcome Home
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  // Use if Global middleware is on inside nuxt.config and you want to exclude this page
  // auth: false
}
</script>
