<template>
  <div class="text-center">
    <v-dialog persistent v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 primary"
          >Checkout <v-icon class="ml-2">mdi-cash</v-icon></v-card-title
        >

        <v-card-text>
          <v-row class="pa-5">
            <v-col cols="6">
              <h1>Credit:</h1>
              <v-text-field
                v-model="form_data.credit"
                :disabled="true"
                type="number"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col class="mb-5" cols="6">
              <h1>Discount:</h1>
              <v-text-field
                v-model="form_data.discount"
                type="number"
              ></v-text-field>
            </v-col>

            <v-col class="mb-5" cols="12">
              <h1>Sub Total: {{ sub_total.toLocaleString('en-US') }}</h1>
            </v-col>
            <v-col cols="12">
              <h1>Cash:</h1>
              <v-text-field
                v-model="customer_cash"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <h1>Change: {{ change.toLocaleString('en-US') }}</h1>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog"> I accept </v-btn>
        </v-card-actions>
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
    form_data: {},
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
  },
  methods: {
    closeDialog() {
      this.dialog = false
      this.$emit('closePaymentDialog')
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
