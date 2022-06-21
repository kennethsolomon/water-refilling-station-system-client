<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="py-4">
        <v-card-title class="headline">
            Private Home Page
        </v-card-title>
        <v-card-text>
            Welcome to Private Home
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" to="/inspire"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DashboardPage',
}
</script>

<style>

</style>