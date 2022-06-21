
<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="py-4">
        <v-card-title class="headline">
           Login 
        </v-card-title>
        <v-card-text>
            Welcome Login Page
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="login()"> Login </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'LoginPage',
  data: () => ({
    form: {
      email: 'john@email.com',
      password: 'password'
    }
  }),

  methods: {
    login() {
      this.$auth.loginWith('laravelSanctum', {
        data: this.form
      })
      .then(response => console.log(response))
      .catch(error => console.log(error))
    }
  }

};
</script>

<style>

</style>