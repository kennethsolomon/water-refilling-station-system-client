<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="60vw" persistent>
      <v-card>
        <v-card-title class="text-h5 primary"
          >{{ mode }} Customer
          <v-spacer></v-spacer>
          <v-icon @click="$emit('close-create-customer-dialog')"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-card-text>
          <v-container>
            <ValidationObserver ref="observer" v-slot="{ valid, invalid }">
              <v-form ref="form" @submit.prevent="createUpdateCustomer">
                <v-row>
                  <v-col cols="4">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      name="First Name"
                    >
                      <v-text-field
                        v-model="form.firstname"
                        label="First Name"
                        hide-details="auto"
                        :error-messages="errors"
                        :success="valid"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="form.middlename"
                      label="Middle Name"
                      hide-details="auto"
                      :success="valid"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      name="Last Name"
                    >
                      <v-text-field
                        v-model="form.lastname"
                        label="Last Name"
                        hide-details="auto"
                        :error-messages="errors"
                        :success="valid"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      name="Address"
                    >
                      <v-textarea
                        v-model="form.address"
                        label="Address"
                        auto-grow
                        rows="1"
                        hide-details="auto"
                        :error-messages="errors"
                        :success="valid"
                      >
                      </v-textarea>
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required|digits:11"
                      name="Contact Number"
                    >
                      <v-text-field
                        v-model="form.contact_number"
                        label="Contact Number"
                        type="number"
                        hide-details="auto"
                        :error-messages="errors"
                        :success="valid"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="mr-4"
                    type="submit"
                    :dark="valid"
                    :disabled="invalid"
                  >
                    submit
                  </v-btn>
                </v-card-actions>
              </v-form>
            </ValidationObserver>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    customerCreateUpdateDialog: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
    selectedCustomer: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: false,

      selected_customer: {},
      form: {
        firstname: null,
        middlename: null,
        lastname: null,
        address: null,
        contact_number: null,
      },
    }
  },

  created() {
    this.dialog = this.customerCreateUpdateDialog
    this.selected_customer = this.selectedCustomer
    if (this.mode === 'Edit') {
      this.fillForm()
    }
  },

  methods: {
    fillForm() {
      this.form = Object.assign({}, this.selected_customer.attributes)
      this.form.id = this.selected_customer.id
    },
    createUpdateCustomer() {
      this.$axios
        .$post('update_or_create_customer', this.form)
        .then((response) => {
          this.$emit('fetch-new-customer-data')
          this.$emit('close-create-customer-dialog')
        })
    },
  },
}
</script>

<style scoped></style>
