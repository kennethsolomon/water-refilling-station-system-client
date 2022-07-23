<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title
            >{{
              transactionDialogData.customer.attributes.fullname
            }}
            Transactions 💸</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-row class="pa-5">
            <v-col cols="6">
              <v-row>
                <v-col cols="8">
                  <v-autocomplete
                    v-model="form.employee_id"
                    label="Select Employee"
                    :items="employees.data"
                    item-value="id"
                    item-text="attributes.fullname"
                    hide-details
                    solo
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="selected_status"
                    label="Select Status"
                    hide-details
                    :items="status"
                    solo
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="form.credit"
                    label="Credit"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="form.discount"
                    label="Discount"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- ORDERS -->
              <v-row>
                <v-col cols="9">
                  <v-autocomplete
                    v-model="selected_item"
                    label="Select Item"
                    :items="items.data"
                    item-text="attributes.name"
                    return-object
                    solo
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="order.quantity"
                    label="Quantity"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-autocomplete
                    v-model="selected_type_of_service"
                    label="Select Service"
                    :items="type_of_service_list"
                    solo
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    v-model="selected_is_borrow"
                    label="Borrow"
                    color="success"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    v-model="selected_is_free"
                    label="Free"
                    color="success"
                    hide-details
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-btn @click="addToOrders()">Add Order</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn @click="submitTransaction()">Submit</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    transactionDialogData: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    dialog: false,
    items: [],
    employees: [],
    status: ['Active', 'Done'],
    type_of_service_list: ['Delivery', 'Pickup', 'Purchase'],
    form: {
      customer_id: '',
      employee_id: '',
      status: '',
      orders: [],
      credit: 0,
      discount: 0,
    },
    compute_orders: [],
    order: {
      item_id: null,
      quantity: '',
      type_of_service: '',
      is_borrow: false,
      is_free: false,
    },

    selected_status: 'Active',
    selected_type_of_service: 'Delivery',
    selected_item: '',
    selected_is_borrow: false,
    selected_is_free: false,
  }),

  async fetch() {
    this.items = await this.$axios.$get(`http://localhost:8000/api/items`)
    this.employees = await this.$axios.$get(
      `http://localhost:8000/api/employees`
    )
  },

  created() {
    this.dialog = this.transactionDialogData.transaction_dialog
    this.form.customer_id = this.transactionDialogData.customer.id
  },

  methods: {
    submitTransaction() {
      this.form.selected_status = this.form.selected_status.toLowerCase()
    },
    addToOrders() {
      this.compute_orders.push(this.selected_item)

      this.form.status = this.selected_status.toLowerCase()
      this.order.item_id = this.selected_item.id
      this.order.type_of_service = this.selected_type_of_service.toLowerCase()
      this.order.is_borrow = this.selected_is_borrow
      this.order.is_free = this.selected_is_free
      this.form.orders.push(this.order)

      this.clearOrder()
      // Add Dialog Success after push
    },
    clearOrder() {
      this.order = {}
      this.selected_item = ''
      this.selected_status = 'Active'
      this.selected_type_of_service = 'Delivery'
      this.selected_is_borrow = false
      this.selected_is_free = false
    },
    // confirmDelete(choice) {
    //   this.$emit('confirmDelete', choice)
    // },
  },
}
</script>

<style scoped></style>
