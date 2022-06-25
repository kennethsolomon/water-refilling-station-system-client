
<template>
  <v-row justify="center" align="center" @keyup.enter="onEnter()">
    <v-col cols="12" sm="8" md="6">
      <v-card class="py-4">
        <v-card-title class="headline"> Login </v-card-title>
        <v-card-text>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.email"
                    :rules="[rules.required, rules.email]"
                    label="E-mail"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.password"
                    :rules="[rules.required, rules.counter]"
                    type="password"
                    label="Password"
                    counter
                    maxlength="20"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :disabled="disabled" @click="login()">
            Login
          </v-btn>
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
      email: 'kenneth@email.com',
      password: 'password',
    },
    disabled: true,
    rules: {
      required: (value) => !!value || 'Required.',
      counter: (value) => value?.length <= 20 || 'Max 20 characters',
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
    },
  }),

  watch: {
    form: {
      immediate: true,
      handler(form) {
        if (form.email.length && form.password.length) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      },
      deep: true,
    },
  },

  mounted() {
    // Sample Global Helper
    this.$add(1, 1)
  },

  methods: {
    login() {
      this.$auth
        .loginWith('laravelSanctum', {
          data: this.form,
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error))
    },

    onEnter() {
      this.login()
    },
  },
}
</script>

<style>
</style>