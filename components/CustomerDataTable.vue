<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="buildCustomers"
      :search="search"
      sort-by="transactions[0].latest_transaction"
      :sort-desc="true"
      data-table-scroll-bar-width="17px"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Customers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            class="mr-3"
            single-line
            hide-details
          ></v-text-field>
          <v-btn color="primary" medium @click="showCustomerCreateDialog()"
            ><v-icon class="mr-2">mdi-plus</v-icon> Add Customer</v-btn
          >
        </v-toolbar>
      </template>
      <template #[`item.gallon`]="{ item }">
        <v-row>
          <v-col cols="12">
            <v-icon
              medium
              :disabled="!item.borrows.length"
              @click="showBarrowListDialog(item.id)"
            >
              mdi-water-alert-outline
            </v-icon>
          </v-col>
        </v-row>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-row>
          <v-col cols="12">
            <v-icon medium class="mr-1" @click="transactionDialog(item)">
              mdi-water-plus
            </v-icon>
            <v-icon
              medium
              class="mr-1"
              @click="$router.push(`/customers/${item.id}`)"
            >
              mdi-eye
            </v-icon>
            <v-icon medium class="mr-1" @click="customerUpdate(item)">
              mdi-pencil
            </v-icon>
            <v-icon medium @click="customerDelete(item)"> mdi-delete </v-icon>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
    <LazyDeleteConfirmationDialog
      v-if="delete_dialog_data.delete_confirmation_dialog"
      :delete-dialog-data="delete_dialog_data"
      @confirmDelete="confirmDelete($event)"
    ></LazyDeleteConfirmationDialog>
    <LazyTransactionDialog
      v-if="transaction_dialog_data.transaction_dialog"
      :transaction-dialog-data="transaction_dialog_data"
      @closeTransactionDialog="closeTransactionDialog($event)"
    ></LazyTransactionDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    search: null,
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Customer Name', value: 'fullname' },
      { text: 'Address', value: 'address' },
      {
        text: 'Credit',
        value: 'credit',
        align: 'center',
      },
      { text: 'Borrow', value: 'gallon', align: 'center' },
      { text: 'Contact Number', value: 'contact_number' },
      {
        text: 'Last Transaction',
        value: 'transactions[0].latest_transaction',
      },
      { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
    ],
    // DELETE DIALOG
    delete_dialog_data: {
      delete_item_id: null,
      delete_item_index: null,
      delete_confirmation_dialog: false,
      delete_title: null,
    },
    // TRANSACTION DIALOG
    transaction_dialog_data: {
      transaction_dialog: false,
      customer: null,
    },
  }),

  computed: {
    ...mapGetters({
      customers: 'getCustomers',
    }),
    buildCustomers() {
      return this.customers?.data?.reduce((list, row) => {
        let total_credit = 0

        // Compute Total Credits
        row.transactions.forEach((element) => {
          total_credit += Number(element?.credit)
        })
        row.credit = total_credit

        list.push(row)
        return list
      }, [])
    },
  },

  methods: {
    showBarrowListDialog(customer_id) {
      this.$emit('show-customer-borrow-list-dialog')
      this.$emit('set-customer-id', customer_id)
    },
    showCustomerCreateDialog() {
      this.$emit('customer-create-dialog')
      this.$emit('set-mode', 'Add')
    },
    customerUpdate(item) {
      this.$emit('customer-update-dialog')
      this.$emit('set-mode', 'Edit')
      this.$emit('selected-customer', item)
    },

    // DELETE DIALOG
    customerDelete(item) {
      this.delete_dialog_data.delete_item_index =
        this.buildCustomers.indexOf(item)

      this.delete_dialog_data.delete_item_id = item.id
      this.delete_dialog_data.delete_title = item.fullname
      this.delete_dialog_data.delete_confirmation_dialog = true
    },
    async confirmDelete(confirm) {
      if (confirm) {
        await this.$axios
          .$delete(
            `http://localhost:8000/api/delete_customer/${this.delete_dialog_data.delete_item_id}`
          )
          .then(() => {
            this.$store.dispatch('callGetCustomers')
            this.deleteCustomerSnackbar()
            this.resetDeleteDialog()
          })
          .finally(() => {
            setTimeout(this.$unSetSnackbar, 7000, this.$store)
          })
      } else {
        this.resetDeleteDialog()
      }
    },
    deleteCustomerSnackbar() {
      this.$store.commit('SET_SNACKBAR', {
        snackbar: {
          status: true,
          text: 'Record successfully deleted!',
          timeout: 5000,
          color: 'error',
        },
      })
    },
    resetDeleteDialog() {
      this.delete_dialog_data.delete_item_id = null
      this.delete_dialog_data.delete_confirmation_dialog = false
      this.delete_dialog_data.delete_title = null
      this.delete_dialog_data.delete_item_index = null
    },
    // END DELETE DIALOG
    closeTransactionDialog(event) {
      this.transaction_dialog_data.transaction_dialog = false
    },
    transactionDialog(item) {
      this.transaction_dialog_data.customer = item
      this.transaction_dialog_data.transaction_dialog = true
    },
  },
}
</script>

<style scoped></style>
