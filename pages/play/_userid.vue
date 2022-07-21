<template>
  <div>
    <v-card class="py-4">
      <v-card-title class="headline"
        >Currently Playing: {{ playerInfo.name }}</v-card-title
      >
      <v-row>
        <v-col>
          <v-card-text
            >Card Remaining:
            <strong>{{ gameConfig.card_remaining }}</strong></v-card-text
          >
        </v-col>
        <v-col>
          <v-btn
            v-if="gameConfig.card_remaining < 52"
            style="float: right"
            class="mt-3 mr-5"
            @click="toogleShowCard()"
            >{{ !showCard ? 'Show Card' : 'Hide Card' }}</v-btn
          >
        </v-col>
      </v-row>

      <v-row class="px-5">
        <v-col v-for="card in playerInfo.cards" :key="card.id" cols="6">
          <v-img
            v-if="showCard"
            class="center_content"
            max-height="350"
            max-width="250"
            :src="card.image"
          ></v-img>
          <v-img
            v-else
            class="center_content"
            max-height="350"
            max-width="250"
            src="/backface.jpg"
          ></v-img>
        </v-col>
      </v-row>

      <v-card-title v-if="gameConfig.drawn_card" class="headline"
        >Drawn Card</v-card-title
      >
      <v-row>
        <v-col class="cols">
          <v-img
            v-if="gameConfig.drawn_card"
            class="center_content"
            max-height="350"
            max-width="250"
            :src="gameConfig.drawn_card.image"
          >
          </v-img>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="cols">
          <v-btn class="center_content" @click="generateCards()"
            >Start Game</v-btn
          >
        </v-col>
        <v-col class="cols">
          <v-btn class="center_content" @click="shuffle()">Shuffle</v-btn>
        </v-col>
        <v-col class="cols">
          <v-btn class="center_content" @click="getGameConfig()">Refresh</v-btn>
        </v-col>
        <v-col class="cols">
          <v-btn class="center_content" @click="setGameConfig()"
            >Game Config</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'GamePage',

  data: () => ({
    cardRemaining: 52,
    currentPlaying: 1,
    potMoney: null,
    drawnCard: null,
    showCard: false,
    players: [],
    gameConfig: [],
    form: {},
  }),

  async fetch() {
    this.players = await this.$axios.$get(
      'http://localhost:8000/api/getAllPlayers'
    )
  },

  computed: {
    playerInfo() {
      return this.players[this.currentPlaying - 1]
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })

    this.getGameConfig()
  },

  methods: {
    async setGameConfig() {
      const shuffledCards = await this.$axios.$get(
        'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
      )

      await this.$axios.$post(
        'http://localhost:8000/api/setGameConfig?new=true',
        shuffledCards
      )

      await this.getGameConfig()
      await this.generateCards()
    },

    async getGameConfig() {
      this.gameConfig = await this.$axios.$get(
        'http://localhost:8000/api/getGameConfig'
      )
      this.distributeCards()
    },

    async generateCards(number = this.players.length * 2) {
      this.$nuxt.$loading.start()
      await this.$axios
        .$get(
          `https://deckofcardsapi.com/api/deck/${this.gameConfig.deck_id}/draw/?count=${number}`
        )
        .then(async (response) => {
          this.form.cards = response.cards

          await this.$axios.$post(
            `http://localhost:8000/api/setGameConfig?cards`,
            this.form
          )

          this.cardRemaining = response.remaining

          await this.drawACard()
          await this.getGameConfig()
        })

      this.distributeCards()

      this.$nuxt.$loading.finish()
    },

    async drawACard(number = 1) {
      this.$nuxt.$loading.start()
      await this.$axios
        .$get(
          `https://deckofcardsapi.com/api/deck/${this.gameConfig.deck_id}/draw/?count=${number}`
        )
        .then(async (response) => {
          this.form.drawn_card = response.cards[0]
          this.form.card_remaining = response.remaining

          await this.$axios.$post(
            `http://localhost:8000/api/setGameConfig?drawn_card&card_remaining`,
            this.form
          )

          await this.getGameConfig()

          this.$nuxt.$loading.finish()
        })
    },

    distributeCards() {
      this.$nuxt.$loading.start()

      const chunk = 2
      let tempCard = []
      const distributedCards = []
      for (let i = 0, j = this.gameConfig?.cards?.length; i < j; i += chunk) {
        tempCard = this.gameConfig?.cards?.slice(i, i + chunk)
        distributedCards.push(tempCard)
      }

      this.players.forEach((player, index) => {
        player.cards = distributedCards[index]
      })
    },

    async shuffle() {
      this.$nuxt.$loading.start()
      await this.$axios
        .$get(
          `https://deckofcardsapi.com/api/deck/${this.gameConfig.deck_id}/shuffle/`
        )
        .then(async (response) => {
          this.form = {}
          this.form.drawn_card = null
          this.form.card = null
          this.form.card_remaining = response.remaining

          await this.$axios.$post(
            `http://localhost:8000/api/setGameConfig?cards&drawn_card&card_remaining`,
            this.form
          )
        })

      await this.getGameConfig()
      this.$nuxt.$loading.finish()
    },

    toogleShowCard() {
      this.showCard = !this.showCard
    },
  },
}
</script>
<style scoped>
.center_content {
  display: block;
  margin: auto;
}
</style>
