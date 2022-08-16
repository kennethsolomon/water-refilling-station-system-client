<template>
  <div>
    <v-card>
      <v-btn
        style="float: right"
        class="ma-3"
        color="primary"
        @click="$router.push(`/customers`)"
        ><v-icon class="mr-2">mdi-keyboard-backspace</v-icon> Back</v-btn
      >
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold text-h2 basil--text">
          {{ transactions.fullname }}
        </h1>
      </v-card-title>

      <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
        <v-tab>Customer Information</v-tab>
        <v-tab>Transaction History</v-tab>
        <v-tab>Borrowed List</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <CustomerInformation
            :transactions="transactions"
          ></CustomerInformation>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <TransactionHistory
                :transactions="transactions.transactions"
              ></TransactionHistory>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <BorrowedList
                :borrows="transactions.borrows"
                @closeReturnDialog="closeReturnDialog()"
              ></BorrowedList>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <SnackBar></SnackBar>
    <LazyTransactionDialog
      v-if="transaction_dialog_data.transaction_dialog"
      :transaction-dialog-data="transaction_dialog_data"
      @closeTransactionDialog="closeTransactionDialog($event)"
    ></LazyTransactionDialog>
  </div>
</template>

<script>
export default {
  name: 'CustomerInfoPage',
  data: () => ({
    tab: null,
    // TRANSACTION DIALOG
    transaction_dialog_data: {
      transaction_dialog: false,
      customer: null,
    },
  }),
  async asyncData({ params, $axios }) {
    const [customer_transactions] = await Promise.all([
      $axios.get(`customer_transactions/${params.customerid}`),
    ])

    return {
      transactions: customer_transactions.data.data[0],
    }
  },

  methods: {
    async closeReturnDialog() {
      await this.$nuxt.refresh()
    },
  },
}
</script>

<style scooped>
/* Helper classes */
.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
}
</style>
