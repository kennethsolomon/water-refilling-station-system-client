<template>
  <v-dialog v-model="dialog" width="auto" persistent>
    <v-card>
      <v-card-title style="color: white" class="text-h5 primary"
        >Return Borrowed Item - {{ form.item_info.name }}
        <v-spacer></v-spacer>
        <v-icon color="white" @click="$emit('closeReturnDialog')"
          >mdi-close</v-icon
        ></v-card-title
      >
      <v-form ref="form" @submit.prevent="returnBorrowedItem">
        <v-card-text>
          <v-alert dense outlined type="error" class="my-3" v-if="input_error">
            Invalid quantity please insure that your input data is correct.
          </v-alert>

          <h3 class="my-3">
            Return Item {{ form.item_info.name }}:
            {{ returnItemBalance }}
          </h3>
          <v-text-field
            v-model.number="return_form.quantity"
            solo
            label="Quantity"
            clearable
            hide-details
          ></v-text-field>
        </v-card-text>
        <v-col class="d-flex justify-end" cols="12">
          <v-btn
            type="submit"
            style="float: right"
            color="primary"
            hide-details
            :disabled="input_error"
            ><v-icon class="mr-2">mdi-keyboard-return</v-icon> Return</v-btn
          >
        </v-col>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {},
    },

    returnDialog: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    returnItemBalance() {
      const balance = this.form.quantity - this.return_form.quantity
      if (balance >= 0) {
        return balance
      } else {
        return 0
      }
    },
  },
  data() {
    return {
      input_error: false,
      dialog: false,
      return_form: {
        id: null,
        quantity: 0,
      },
    }
  },
  methods: {
    returnBorrowedItem() {
      console.log('test')
      this.$axios
        .$post(`return_item/${this.return_form.id}`, this.return_form)
        .then((response) => {
          // Snack Bar
          this.$store.commit('SET_SNACKBAR', {
            snackbar: {
              status: true,
              text: 'Item return successfully!',
              timeout: 5000,
              color: 'primary',
            },
          })

          this.$emit('closeReturnDialog')
        })
        .finally(() => {
          setTimeout(this.$unSetSnackbar, 7000, this.$store)
        })
    },
  },
  watch: {
    returnItemBalance(new_val) {
      const balance = this.form.quantity - this.return_form.quantity
      if (balance < 0) {
        this.input_error = true
      } else {
        this.input_error = false
      }
    },

    'return_form.quantity'(new_val, old_val) {
      if (new_val === '' || new_val < 0 || new_val === null) {
        this.input_error = true
      }
    },
  },
  created() {
    this.dialog = this.returnDialog
    this.return_form.id = this.form.id
    this.return_form.quantity = Number(this.form.quantity)
  },
}
</script>

<style scoped></style>
