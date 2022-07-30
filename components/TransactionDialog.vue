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
            >{{ transactionDialogData.customer.attributes.fullname }}
            Transactions 💸
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="closeTransactionDialog">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-row class="pa-5">
            <v-col cols="6">
              <ValidationObserver ref="observer" v-slot="{ valid, invalid }">
                <v-row>
                  <v-col cols="8">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      name="Employee"
                    >
                      <v-autocomplete
                        v-model="form.employee_id"
                        label="Select Employee"
                        :items="employees.data"
                        item-value="id"
                        item-text="attributes.fullname"
                        hide-details
                        solo
                        :error-messages="errors"
                        :success="valid"
                      >
                      </v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="4">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      name="Status"
                    >
                      <v-autocomplete
                        v-model="selected_status"
                        label="Select Status"
                        hide-details
                        :items="status"
                        solo
                        :error-messages="errors"
                        :success="valid"
                      >
                      </v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                </v-row>

                <v-card class="mx-auto mt-3">
                  <v-card-text>
                    <p class="text-h6 text--primary">Order:</p>

                    <!-- ORDERS -->
                    <v-row>
                      <v-col cols="9">
                        <ValidationProvider
                          v-slot="{ errors }"
                          rules="required"
                          name="Item"
                        >
                          <v-autocomplete
                            v-model="selected_item"
                            label="Select Item"
                            :items="items.data"
                            item-text="attributes.name"
                            return-object
                            solo
                            :error-messages="errors"
                            :success="valid"
                          >
                          </v-autocomplete>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="3">
                        <ValidationProvider
                          v-slot="{ errors }"
                          rules="required"
                          name="Quantity"
                        >
                          <v-text-field
                            v-model="order.quantity"
                            label="Quantity"
                            type="number"
                            :error-messages="errors"
                            :success="valid"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <ValidationProvider
                          v-slot="{ errors }"
                          rules="required"
                          name="Type of Service"
                        >
                          <v-autocomplete
                            v-model="selected_type_of_service"
                            label="Select Service"
                            :items="type_of_service_list"
                            solo
                            :error-messages="errors"
                            :success="valid"
                          >
                          </v-autocomplete>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="2">
                        <v-checkbox
                          v-model="selected_is_borrow"
                          label="Borrow"
                          color="success"
                          hide-details
                          :success="valid"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="2">
                        <v-checkbox
                          v-model="selected_is_purchase"
                          @click="disableCheckbox('purchase')"
                          :disabled="checkbox_purchase"
                          label="Purchase"
                          color="success"
                          hide-details
                          :success="valid"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="2">
                        <v-checkbox
                          v-model="selected_is_free"
                          @click="disableCheckbox('free')"
                          :disabled="checkbox_free"
                          label="Free"
                          color="success"
                          hide-details
                          :success="valid"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      class="ma-3 pa-4"
                      large
                      color="primary"
                      @click="addToOrders()"
                      :dark="valid"
                      :disabled="invalid"
                    >
                      Add to Cart<v-icon class="ml-2">mdi-cart-plus</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </ValidationObserver>
            </v-col>

            <!-- Order List and Calculation -->
            <v-col cols="6" class="mt-2">
              <v-row>
                <v-col>
                  <div class="d-flex display-block">
                    <p class="text-h6 text--primary">Order List:</p>
                    <v-spacer></v-spacer>
                    <v-btn
                      large
                      color="primary"
                      @click="checkOut()"
                      :disabled="form.orders.length <= 0"
                      >Checkout <v-icon class="ml-2">mdi-cart</v-icon></v-btn
                    >
                  </div>

                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="form.transaction_date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.transaction_date"
                        label="Transaction Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.transaction_date"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(form.transaction_date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>

                  <v-data-table
                    :headers="headers"
                    :items="form.orders"
                    :items-per-page="10"
                    group-by="item_name"
                    class="elevation-1"
                  >
                    <template v-slot:group.header="{ items, isOpen, toggle }">
                      <th
                        :colspan="headers.length"
                        style="cursor: pointer"
                        @click="toggle"
                      >
                        <v-btn :ref="items" small icon :data-open="isOpen">
                          <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
                          <v-icon v-else>mdi-chevron-down</v-icon>
                        </v-btn>
                        <span class="subtitle-1">
                          <strong>{{ items[0].item_name }}</strong>
                        </span>
                        <span class="subtitle-1" style="float: right"
                          ><strong
                            >Total:
                            {{
                              buildTotalOrderByItem[
                                items[0].item_name
                              ].toLocaleString('en-US')
                            }}</strong
                          ></span
                        >
                      </th>
                    </template>
                    <template #[`item.is_borrow`]="{ item }">
                      {{ item.is_borrow ? '✅' : '❌' }}
                    </template>
                    <template #[`item.is_purchase`]="{ item }">
                      {{ item.is_purchase ? '✅' : '❌' }}
                    </template>
                    <template #[`item.is_free`]="{ item }">
                      {{ item.is_free ? '✅' : '❌' }}
                    </template>
                    <template #[`item.type_of_service`]="{ item }">
                      {{
                        item.type_of_service.charAt(0).toUpperCase() +
                        item.type_of_service.slice(1)
                      }}
                    </template>

                    <template #[`item.actions`]="{ item, index }">
                      <v-icon @click="deleteOrder(item, index)" color="error"
                        >mdi-trash-can-outline</v-icon
                      >
                      <!-- <v-btn>Test {{ item }} {{ index }}</v-btn> -->
                    </template>
                    <template #body.append>
                      <tr>
                        <td></td>
                        <td colspan="4"></td>
                        <td><h1>Total:</h1></td>
                        <td>
                          <h1>{{ totalOrder }}</h1>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <PaymentDialog
      v-if="form.payment_dialog"
      :form="form"
      @closePaymentDialog="form.payment_dialog = false"
      @closeTransactionDialog="closeTransactionDialog"
    ></PaymentDialog>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    transactionDialogData: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    dialog: false,
    menu: false,
    checkbox_free: false,
    checkbox_purchase: false,
    // items: [],
    // employees: [],
    status: ['Active', 'Done'],
    type_of_service_list: ['Delivery', 'Pickup'],
    form: {
      customer_id: '',
      employee_id: '',
      status: '',
      orders: [],
      credit: null,
      discount: null,
      total_order_by_item: {},
      transaction_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      payment_dialog: false,
    },
    order: {
      item_id: null,
      quantity: '',
      type_of_service: '',
      is_borrow: false,
      is_purchase: false,
      is_free: false,
    },

    selected_status: 'Active',
    selected_type_of_service: 'Delivery',
    selected_item: '',
    selected_is_borrow: false,
    selected_is_purchase: false,
    selected_is_free: false,

    headers: [
      { text: 'Name', value: 'item_name' },
      { text: 'Type of Service', value: 'type_of_service' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Price', value: 'item_price' },
      { text: 'Borrow', value: 'is_borrow' },
      { text: 'Purchase', value: 'is_purchase' },
      { text: 'Free', value: 'is_free' },
      { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
    ],
  }),

  async fetch() {
    await this.$store.dispatch('callGetItems')
    await this.$store.dispatch('callGetEmployees')
  },

  computed: {
    ...mapGetters({
      items: 'getItems',
      employees: 'getEmployees',
    }),
    buildTotalOrderByItem() {
      const total_order_list = {}
      return this.form.orders.reduce((list, row) => {
        if (!row.is_free) {
          total_order_list[row.item_name] =
            (total_order_list[row.item_name] || 0) +
            row.quantity * row.item_price
        } else {
          total_order_list[row.item_name] = total_order_list[row.item_name] || 0
        }

        this.form.total_order_by_item = total_order_list

        return total_order_list
      }, [])
    },
    totalOrder() {
      const total = Object.values(this.form.total_order_by_item).reduce(
        (a, b) => a + b,
        0
      )
      return total.toLocaleString('en-US')
    },
  },

  created() {
    this.dialog = this.transactionDialogData.transaction_dialog
    this.form.customer_id = this.transactionDialogData.customer.id
  },

  methods: {
    deleteOrder(item, index) {
      // const index = this.form.orders.indexOf(item)
      this.form.total_order_by_item[item.item_name] -=
        item.item_price * Number(item.quantity)
      this.form.orders.splice(index, 1)
    },
    disableCheckbox(checkbox) {
      if (checkbox === 'free') {
        this.checkbox_purchase = !this.checkbox_purchase
      } else if (checkbox === 'purchase') {
        this.checkbox_free = !this.checkbox_free
      }
    },
    closePaymentDialog(event) {
      this.form.payment_dialog = false
    },
    checkOut() {
      this.form.payment_dialog = true
    },
    addToOrders() {
      // Item
      this.order.item_id = this.selected_item.id
      this.order.item_name = this.selected_item.attributes.name
      if (this.selected_is_purchase) {
        this.order.item_price = this.selected_item.attributes.purchase_price
      } else if (
        this.selected_type_of_service.toLowerCase() === 'delivery' &&
        !this.selected_is_purchase
      ) {
        this.order.item_price = this.selected_item.attributes.delivery_price
      } else if (
        this.selected_type_of_service.toLowerCase() === 'pickup' &&
        !this.selected_is_purchase
      ) {
        this.order.item_price = this.selected_item.attributes.pickup_price
      }

      this.form.status = this.selected_status.toLowerCase()
      this.order.type_of_service = this.selected_type_of_service.toLowerCase()
      this.order.is_borrow = this.selected_is_borrow
      this.order.is_purchase = this.selected_is_purchase
      this.order.is_free = this.selected_is_free

      this.form.orders.push(this.order)

      this.clearOrder()
      // Add Dialog Success after push
    },
    clearOrder() {
      this.order = {}
      this.$refs.observer.reset()
      this.selected_item = ''
      this.selected_status = 'Active'
      this.selected_type_of_service = 'Delivery'
      this.selected_is_borrow = false
      this.selected_is_purchase = false
      this.selected_is_free = false
      this.checkbox_free = false
      this.checkbox_purchase = false
    },
    closeTransactionDialog() {
      this.$emit('closeTransactionDialog')
    },
    // confirmDelete(choice) {
    //   this.$emit('confirmDelete', choice)
    // },
  },
}
</script>

<style scoped></style>
