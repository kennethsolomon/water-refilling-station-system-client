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
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-row class="pa-5">
                <v-col cols="2" class="pa-0">
                  <h3>Address:</h3>
                </v-col>
                <v-col cols="10" class="pa-0">
                  <h3>{{ transactions.address }}</h3>
                </v-col>
                <v-col cols="2" class="pa-0">
                  <h3>Contact Number:</h3>
                </v-col>
                <v-col cols="10" class="pa-0">
                  <h3>{{ transactions.contact_number }}</h3>
                </v-col>
                <v-col cols="2" class="pa-0">
                  <h3>Total Credits:</h3>
                </v-col>
                <v-col cols="10" class="pa-0">
                  <h3>{{ computeCredit }}</h3>
                </v-col>
                <v-col cols="2" class="pa-0">
                  <h3>Total Borrowed Items:</h3>
                </v-col>
                <v-col cols="10" class="pa-0">
                  <h3>{{ transactions.borrows.length }}</h3>
                </v-col>
                <v-col cols="2" class="pa-0">
                  <h3>Total Transactions:</h3>
                </v-col>
                <v-col cols="10" class="pa-0">
                  <h3>{{ transactions.transactions.length }}</h3>
                </v-col>

                <v-col cols="2" class="pa-0">
                  <h3>Customer Since:</h3>
                </v-col>
                <v-col cols="10" class="pa-0">
                  <h3>{{ transactions.register_customer }}</h3>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
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
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'CustomerInfoPage',
  data: () => ({
    tab: null,
  }),
  async asyncData({ params, $axios }) {
    const [customer_transactions] = await Promise.all([
      $axios.get(`customer_transactions/${params.customerid}`),
    ])

    return {
      transactions: customer_transactions.data.data[0],
    }
  },

  computed: {
    computeCredit() {
      let total_credit = 0
      return this.transactions?.transactions?.reduce((list, row) => {
        total_credit += Number(row?.credit)

        return total_credit
      }, [])
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
