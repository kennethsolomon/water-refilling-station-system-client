<template>
  <div class="text-center">
    <v-dialog persistent v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 primary"
          >Checkout <v-icon class="ml-2">mdi-cash</v-icon>
          <v-spacer></v-spacer>
          <v-icon @click="closeDialog">mdi-close</v-icon></v-card-title
        >

        <v-card-text>
          <ValidationObserver ref="observer" v-slot="{ valid, invalid }">
            <v-row class="pa-5">
              <v-col cols="6">
                <h2><v-icon>mdi-cash-plus</v-icon> Credit:</h2>
                <v-text-field
                  v-model="form_data.credit"
                  :disabled="true"
                  type="number"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col class="mb-5" cols="6">
                <h2><v-icon>mdi-cash-minus</v-icon> Discount:</h2>

                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  name="Discount"
                >
                  <v-text-field
                    v-model.number="form_data.discount"
                    type="number"
                    :error-messages="errors"
                    :success="valid"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>

              <v-col class="mb-5" cols="12">
                <v-alert
                  color="error"
                  dark
                  icon="mdi-cash"
                  border="left"
                  prominent
                >
                  <h1>Sub Total: {{ sub_total.toLocaleString('en-US') }}</h1>
                </v-alert>
              </v-col>

              <v-col cols="12">
                <h2>
                  <v-icon>mdi-account-cash-outline</v-icon> Customers Cash:
                </h2>
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  name="Cash"
                >
                  <v-text-field
                    v-model.number="customer_cash"
                    type="number"
                    :error-messages="errors"
                    :success="valid"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>

              <v-col cols="12">
                <v-alert
                  color="primary"
                  dark
                  icon="mdi-cash-refund"
                  border="left"
                >
                  <h2>Change: {{ change.toLocaleString('en-US') }}</h2>
                </v-alert>
              </v-col>

              <v-col class="d-flex justify-end" cols="12">
                <v-btn
                  color="primary"
                  @click="confirmPayment"
                  :dark="valid"
                  :disabled="invalid"
                >
                  Confirm Pay <v-icon class="ml-2">mdi-cash-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </ValidationObserver>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    dialog: false,
    form_data: {
      discount: 0,
    },
    customer_cash: 0,
    total_order: 0,
    sub_total: 0,
  }),

  computed: {
    totalOrder() {
      const total = Object.values(this.form_data.total_order_by_item).reduce(
        (a, b) => {
          if (a > 0) {
            this.total_order = a + b
            this.sub_total = a + b
          } else {
            this.total_order = b
            this.sub_total = b
          }
          return a + b
        },
        0
      )
      return total
    },
    change() {
      if (this.customer_cash > 0) {
        if (this.customer_cash - this.sub_total > 0) {
          return this.customer_cash - this.sub_total
        }
      }
      return 0
    },
  },

  created() {
    this.dialog = this.form.payment_dialog
    this.form_data = this.form
    this.form_data.credit = this.totalOrder
    this.form_data.discount = 0
  },
  methods: {
    closeDialog() {
      this.dialog = false
      this.$emit('closePaymentDialog')
    },
    confirmPayment() {
      this.$axios
        .$post('update_or_create_transaction', this.form_data)
        .then((response) => {
          console.log(response)
          this.closeDialog()
          this.$store.dispatch('callGetCustomers')
          this.$emit('closeTransactionDialog')
        })
    },
  },

  watch: {
    customer_cash(new_val, old_val) {
      if (new_val > this.sub_total) {
        this.form_data.credit = 0
      } else {
        this.form_data.credit = this.sub_total - new_val
      }
    },
    'form_data.discount'(new_val, old_val) {
      this.customer_cash = null
      this.sub_total = this.total_order - new_val
      this.form_data.credit = this.total_order - new_val
    },
  },
}
</script>

<style scoped></style>
