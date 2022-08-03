<template>
  <v-card color="basil">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold text-h2 basil--text">
        {{ transactions.fullname }}
      </h1>
    </v-card-title>

    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab>Customer Information</v-tab>
      <v-tab>Transaction List</v-tab>
      <v-tab>Borrowed Items</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card color="basil" flat>
          <v-card-text>
            <h3>Fullname: {{ transactions.fullname }}</h3>
            <h3>Address: {{ transactions.address }}</h3>
            <h3>Contact Number: {{ transactions.contact_number }}</h3>
            <h3>Total Credits: {{ computeCredit }} Pesos</h3>
            <h3>
              Total Borrowed Items:
              {{ transactions.borrows.length }} Borrowed Items
            </h3>
            <h3>
              Total Transactions:
              {{ transactions.transactions.length }} Transactions
            </h3>
            <h3>Customer Since: {{ transactions.register_customer }}</h3>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card color="basil" flat>
          <v-card-text>Transaction List</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card color="basil" flat>
          <v-card-text>Borroed Items</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
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
