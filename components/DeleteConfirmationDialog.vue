<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 error"
          >Delete {{ deleteDialogData.delete_title }}</v-card-title
        >

        <v-card-text>
          <v-container>
            <v-row class="d-flex align-center">
              <v-col cols="3">
                <img
                  src="/trash.png"
                  height="100px"
                  alt="delete_icon"
                  srcset="/trash.png"
                />
              </v-col>
              <v-col cols="9">
                <div>
                  Are you sure you want to <strong>delete </strong>
                  <em>{{ deleteDialogData.delete_title }}</em> ? This action is
                  <strong>not reversable</strong> .
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="confirmDelete(true)">
            Delete
          </v-btn>
          <v-btn color="primary" text @click="confirmDelete(false)">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    deleteDialogData: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    dialog: false,
  }),

  created() {
    this.dialog = this.deleteDialogData.delete_confirmation_dialog
  },

  methods: {
    confirmDelete(choice) {
      this.$emit('confirmDelete', choice)
    },
  },
}
</script>

<style scoped></style>
