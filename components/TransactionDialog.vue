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

              <v-card class="mx-auto mt-3">
                <v-card-text>
                  <p class="text-h6 text--primary">Order:</p>

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
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="addToOrders()">
                    Add To Cart
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <!-- Order List and Calculation -->
            <v-col cols="6">
              <v-row>
                <v-col>
                  <p class="text-h6 text--primary">Order List:</p>
                  <v-data-table
                    :headers="headers"
                    :items="form.orders"
                    :items-per-page="10"
                    group-by="item_name"
                    class="elevation-1"
                  >
                    <template
                      v-slot:group.header="{ items, headers, isOpen, toggle }"
                    >
                      <th
                        :colspan="headers.length"
                        @click="toggle"
                        style="cursor: pointer"
                      >
                        <v-btn small icon :ref="items" :data-open="isOpen">
                          <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
                          <v-icon v-else>mdi-chevron-down</v-icon>
                        </v-btn>
                        <span class="subtitle-1">
                          <strong>{{ items[0].item_name }}</strong>
                        </span>
                        <span class="subtitle-1" style="float: right"
                          ><strong
                            >Total:
                            {{ buildTotalOrderByItem[items[0].item_name] }}</strong
                          ></span
                        >
                      </th>
                    </template>
                    <template #body.append>
                      <tr>
                        <td colspan="3"></td>
                        <td>Total:</td>
                        <td>Kenneth SOlomon</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
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

    headers: [
      { text: 'Name', value: 'item_name' },
      { text: 'Free', value: 'is_free' },
      { text: 'Borrow', value: 'is_borrow' },
      { text: 'Type of Service', value: 'type_of_service' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Price', value: 'item_price' },
    ],

    total_order_by_item: {},
  }),

  async fetch() {
    this.items = await this.$axios.$get(`http://localhost:8000/api/items`)
    this.employees = await this.$axios.$get(
      `http://localhost:8000/api/employees`
    )
  },

  computed: {
    buildTotalOrderByItem() {
      const total_order_list = {}
      return this.form.orders.reduce((list, row) => {
        total_order_list[row.item_name] =
          (total_order_list[row.item_name] || 0) + row.quantity * row.item_price

        this.total_order_by_item = total_order_list

        return total_order_list
      }, [])
    },
    totalOrder() {
      const total = Object.values(this.total_order_by_item).reduce(
        (a, b) => a + b,
        0
      )
      return total
    },
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
      // Item
      this.order.item_id = this.selected_item.id
      this.order.item_name = this.selected_item.attributes.name
      this.order.item_price = this.selected_item.attributes.price

      this.form.status = this.selected_status.toLowerCase()
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