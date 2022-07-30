<template>
  <v-row>
    <v-col cols="12">
      <v-card class="ma-3">
        <div v-if="$fetchState.pending">Loading ...</div>
        <div v-else-if="$fetchState.error">
          Error: {{ $fetchState.error.message }}
        </div>
        <v-card-text v-else>
          <CustomerDataTable
            :customers="customers"
            @customer-create-dialog="customer_create_update_dialog = true"
            @customer-update-dialog="customer_create_update_dialog = true"
            @set-mode="setMode($event)"
            @show-customer-borrow-list-dialog="
              customer_borrow_list_dialog = true
            "
            @set-customer-id="setCustomerId($event)"
            @selected-customer="customerEdit($event)"
          ></CustomerDataTable>
        </v-card-text>
        <CustomerBorrowListDialog
          v-if="customer_borrow_list_dialog"
          :show-customer-borrow-list-dialog="customer_borrow_list_dialog"
          :customer-id="customer_id"
          @close-customer-borrow-list-dialog="
            customer_borrow_list_dialog = false
          "
        ></CustomerBorrowListDialog>
        <CustomerAddEditDialog
          v-if="customer_create_update_dialog"
          :customer-create-update-dialog="customer_create_update_dialog"
          :selected-customer="selected_customer"
          :mode="mode"
          @close-create-customer-dialog="customer_create_update_dialog = false"
          @fetch-new-customer-data="fetchNewCustomerData"
        >
        </CustomerAddEditDialog>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CustomersPage',
  data: () => ({
    customer_borrow_list_dialog: false,
    customer_create_update_dialog: false,
    mode: null,
    customer_id: null,
    selected_customer: {},
  }),
  async fetch() {
    const customers = await this.$axios.$get(
      'http://localhost:8000/api/customers'
    )
    this.$store.commit('SET_CUSTOMERS', customers)
  },

  computed: {
    ...mapGetters({
      customers: 'getCustomers',
    }),
  },

  methods: {
    setCustomerId(customer_id) {
      this.customer_id = Number(customer_id)
    },
    setMode(mode) {
      this.mode = mode
    },
    fetchNewCustomerData() {
      this.$fetch()
    },
    customerEdit(selected_customer) {
      this.selected_customer = selected_customer
    },
  },
}
</script>
<style scoped></style>
