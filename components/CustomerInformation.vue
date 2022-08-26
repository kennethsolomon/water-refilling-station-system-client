<template>
  <v-card flat>
    <v-card-text>
      <div class="d-flex justify-end align-center">
        <v-icon class="mr-1">mdi-account-circle-outline</v-icon>
        Customer Since:
        <strong>{{ transactions.register_customer }}</strong>
      </div>
      <div class="d-flex">
        <!-- Transactions -->
        <Card
          :properties="{
            icon: 'mdi-file-document-multiple-outline',
            color: 'primary',
            title: 'Transactions',
            symbol: '',
            data: transactions.transactions.length,
          }"
        ></Card>
        <!-- Credits -->
        <Card
          :properties="{
            icon: 'mdi-cash-lock',
            color: 'success',
            title: 'Credits',
            symbol: '₱ ',
            data: computeCredit,
          }"
        ></Card>
        <!-- Borrows -->
        <Card
          :properties="{
            icon: 'mdi-water-minus-outline',
            color: 'warning',
            title: 'Borrows',
            symbol: '',
            data: transactions.borrows.length,
          }"
        ></Card>
      </div>

      <v-row class="mt-5">
        <v-col cols="8">
          <v-text-field
            v-model="transactions_data.address"
            readonly
            outlined
            label="Address"
            prepend-inner-icon="mdi-map-marker"
          >
          </v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="transactions_data.contact_number"
            readonly
            outlined
            label="Contact Number"
            prepend-inner-icon="mdi-card-account-phone"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    transactions: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    transactions_data: {},
  }),

  computed: {
    computeCredit() {
      let total_credit = 0
      return this.transactions?.transactions?.reduce((list, row) => {
        total_credit += Number(row?.credit)

        return total_credit
      }, 0)
    },
  },

  created() {
    this.transactions_data = this.transactions
  },
}
</script>

<style scooped>
/* Helper classes */
.white--text {
  color: #ffffff !important;
}
</style>
