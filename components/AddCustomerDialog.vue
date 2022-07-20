<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="60vw" persistent>
      <v-card>
        <v-card-title class="text-h5 primary"
          >{{ mode }} Customer
          <v-spacer></v-spacer>
          <v-icon @click="$emit('closeCreateCustomerDialog')"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-card-text>
          <!-- TODO: Make Loading Component -->
          <div v-if="$fetchState.pending" width="40%" height="100%">
            Loading ...
          </div>
          <div v-else-if="$fetchState.error">
            Error: {{ $fetchState.error.message }}
          </div>
          <v-container v-else>
            <ValidationObserver ref="observer" v-slot="{ valid, invalid }">
              <v-form ref="form" @submit.prevent="createNewCustomer">
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
                      rules="required"
                      name="Classification"
                    >
                      <v-select
                        v-model="form.classification_id"
                        :items="classifications.data"
                        label="Classification"
                        item-text="attributes.name"
                        item-value="id"
                        hide-details="auto"
                        :error-messages="errors"
                        :success="valid"
                      ></v-select>
                    </ValidationProvider>
                  </v-col>
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
    createCustomerDialog: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,

      classifications: [],
      customer_borrowed_items: [],
      form: {
        classification_id: null,
        firstname: null,
        middlename: null,
        lastname: null,
        address: null,
        contact_number: null,
      },
    }
  },

  async fetch() {
    this.classifications = await this.$axios.$get(
      `http://localhost:8000/api/classifications`
    )
  },

  created() {
    this.dialog = this.createCustomerDialog
  },

  methods: {
    createNewCustomer() {
      // Do Something
    },
  },
}
</script>

<style scoped></style>
