<template>
  <div class="filter__list -detail">
    <div class="character -column" v-if="isLoaded">
      <a href="/" class="back">&laquo; Back</a>
      <div
        class="character__info -detail"
        v-for="(item, index) in characterData"
        :key="index"
      >{{index}}: {{item}}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "List",
  data() {
    return {
      isLoaded: false,
      items: [],
      characterData: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList: function() {
      axios.get("/src/data.json").then(response => {
        this.items = response.data.units;
        this.characterData = this.items.find(
          item => item.id == this.$route.params.id
        );
        this.isLoaded = true;
      });
    }
  }
};
</script>
