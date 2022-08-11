<template>
  <v-card flat>
    <v-card-text>
      <div class="d-flex justify-end align-center">
        <v-icon class="mr-1">mdi-account-circle-outline</v-icon>
        Customer Since:
        <strong>{{ transactions.register_customer }}</strong>
      </div>
      <div class="d-flex">
        <v-card max-width="200" color="primary" class="rounded-xl mr-2">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-2 white--text">
                <v-icon color="white"
                  >mdi-file-document-multiple-outline</v-icon
                >
                Transactions
              </div>
              <v-list-item-title class="text-h5 mb-1 white--text">
                {{ transactions.transactions.length }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card max-width="200" color="success" class="rounded-xl mr-2">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-2 white--text">
                <v-icon color="white">mdi-cash-lock</v-icon> Credits
              </div>
              <v-list-item-title class="text-h5 mb-1 white--text">
                ₱ {{ computeCredit }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card max-width="200" color="warning" class="rounded-xl mr-2">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-2 white--text">
                <v-icon color="white">mdi-water-minus-outline</v-icon> Borrows
              </div>
              <v-list-item-title class="text-h5 mb-1 white--text">
                {{ transactions.borrows.length }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
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
      }, [])
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
