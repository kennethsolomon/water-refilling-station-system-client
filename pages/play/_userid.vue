<template>
  <div>
    <v-card class="py-4">
      <v-card-title class="headline"
        >Currently Playing: {{ playerInfo.name }}</v-card-title
      >
      <v-row>
        <v-col>
          <v-card-text
            >Card Remaining: <strong>{{ cardRemaining }}</strong></v-card-text
          >
        </v-col>
        <v-col>
          <v-btn
            v-if="cardRemaining < 52"
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

      <v-card-title v-if="drawnCard" class="headline">Drawn Card</v-card-title>
      <v-row>
        <v-col class="cols">
          <v-img
            v-if="drawnCard"
            class="center_content"
            max-height="350"
            max-width="250"
            :src="drawnCard.image"
          >
          </v-img>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="cols">
          <v-btn
            class="center_content"
            @click="drawACard('start', players.length * 2)"
            >Start Game</v-btn
          >
        </v-col>
        <v-col class="cols">
          <v-btn class="center_content" @click="shuffle()">Shuffle</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'GamePage',

  data: () => ({
    shuffledCards: [],
    cardRemaining: 52,
    currentPlaying: 1,
    potMoney: null,
    drawnCard: null,
    showCard: false,
    testPlayers: [],
    players: [
      {
        id: 1,
        name: 'Kenneth',
        cards: [],
        bet: 0,
        money: 100,
      },
      {
        id: 2,
        name: 'Camille',
        cards: [],
        bet: 0,
        money: 100,
      },
      {
        id: 3,
        name: 'Mely',
        cards: [],
        bet: 0,
        money: 100,
      },
    ],
    form: {
      deck_id: '123asd',
      current_playing: 1,
      drawn_card: {},
      cards: [],
    },
  }),

  async fetch() {
    this.shuffledCards = await this.$axios.$get(
      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    )
    // this.testPlayers = await this.$axios.$get('http://localhost:8000/api/getAllPlayers').then( response=> response)
  },

  computed: {
    playerInfo() {
      return this.players[this.currentPlaying - 1]
    },
  },

  mounted() {
    this.gameConfig()
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
    console.log(this.shuffledCards)
    console.log(this.players)
  },

  methods: {
    gameConfig() {
      this.$axios.$post('http://localhost:8000/api/gameConfig', this.form)
    },
    toogleShowCard() {
      this.showCard = !this.showCard
    },
    async drawACard(status, number) {
      this.$nuxt.$loading.start()
      const card = await this.$axios
        .$get(
          `https://deckofcardsapi.com/api/deck/${this.shuffledCards.deck_id}/draw/?count=${number}`
        )
        .then((response) => {
          this.$nuxt.$loading.finish()
          return response
        })

      if (status === 'start') {
        this.drawACard('playing', 1)
        const chunk = 2
        let tempCard = []
        const distributedCards = []
        for (let i = 0, j = card.cards.length; i < j; i += chunk) {
          tempCard = card.cards.slice(i, i + chunk)
          distributedCards.push(tempCard)
        }

        this.players.forEach((player, index) => {
          player.cards = distributedCards[index]
        })

        this.currentPlaying < this.players.length
          ? (this.currentPlaying += 1)
          : this.cardRemaining === 52
          ? ''
          : (this.currentPlaying = 1)

        // v2 Code
        // let start = 0
        // const chunkCount = 2
        // const chunks = card.cards.map((pair, i)=>{
        //   const chunk = card.cards.slice(i+start, i+(chunkCount+start));
        //   start+=1; return chunk;
        // })

        // const pair = chunks.filter(pair => {
        //   return pair.length !== 0
        // })

        console.log('Start', card)
      } else if (status === 'playing') {
        this.drawnCard = card.cards[0]
        console.log('Playing', card)
      }

      this.cardRemaining = card.remaining
    },

    async shuffle() {
      await this.$axios
        .$get(
          `https://deckofcardsapi.com/api/deck/${this.shuffledCards.deck_id}/shuffle/`
        )
        .then((response) => {
          this.shuffledCards = response
          this.cardRemaining = response.remaining

          this.drawACard('start', this.players.length * 2)
          console.log('Shuffle', response)
        })
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
