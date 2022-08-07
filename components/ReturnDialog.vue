<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title style="color: white" class="text-h5 primary"
          >Return Borrowed Item - {{ form.item_info.name }}
          <v-spacer></v-spacer>
          <v-icon color="white" @click="$emit('closeReturnDialog')"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-card-text>
          <v-container>
            <v-alert dense outlined type="error" v-if="input_error">
              Invalid quantity please insure that your input data is correct.
            </v-alert>
            <h3 class="mb-4">
              Return Item {{ form.item_info.name }}:
              {{ returnItemBalance }}
            </h3>
            <v-text-field
              v-model.number="return_form.quantity"
              solo
              label="Quantity"
              clearable
            ></v-text-field>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
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
  watch: {
    returnItemBalance(newValue) {
      const balance = this.form.quantity - this.return_form.quantity
      if (balance < 0) {
        this.input_error = true
      } else {
        this.input_error = false
      }
    },
  },
  created() {
    this.dialog = this.returnDialog
    this.return_form.id = this.form.id
  },
}
</script>

<style scoped></style>
