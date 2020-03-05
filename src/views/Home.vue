<template>
  <div class="filter" v-if="isLoaded">
    <div class="filter__wrapper">
      <h1 class="filter__head">Choose your character for making history!</h1>
      <div class="filter__input">
        <div class="filter__tag">ages</div>
        <div class="filter__button">
          <div class="button-item">
            <input type="radio" name="all" id="all" value v-model="age" />
            <label for="all">All</label>
          </div>
          <div class="button-item">
            <input type="radio" name="dark" id="dark" value="dark" v-model="age" />
            <label for="dark">Dark</label>
          </div>
          <div class="button-item">
            <input type="radio" id="feudal" name="feudal" value="feudal" v-model="age" />
            <label for="feudal">Feudal</label>
          </div>
          <div class="button-item">
            <input type="radio" id="castle" name="castle" value="castle" v-model="age" />
            <label for="castle">Castle</label>
          </div>
          <div class="button-item">
            <input type="radio" id="imperial" name="imperial" value="imperial" v-model="age" />
            <label for="imperial">Imperial</label>
          </div>
        </div>
      </div>
      <div class="filter__input">
        <div class="filter__tag">food</div>
        <div class="filter__slider">
          <span class="filter__slider__value">{{foodStart}}</span>
          <input type="range" class="slider" v-model="foodStart" :min="foodMin" :max="foodMax" />
          <span class="filter__slider__value">{{foodEnd}}</span>
          <input type="range" class="slider" v-model="foodEnd" :min="foodMin" :max="foodMax" />
        </div>
      </div>
      <div class="filter__input">
        <div class="filter__tag">wood</div>
        <div class="filter__slider">
          <span class="filter__slider__value">{{woodStart}}</span>
          <input type="range" class="slider" v-model="woodStart" :min="woodMin" :max="woodMax" />
          <span class="filter__slider__value">{{woodEnd}}</span>
          <input type="range" class="slider" v-model="woodEnd" :min="woodMin" :max="woodMax" />
        </div>
      </div>
      <div class="filter__input">
        <div class="filter__tag">gold</div>
        <div class="filter__slider">
          <span class="filter__slider__value">{{goldStart}}</span>
          <input type="range" class="slider" v-model="goldStart" :min="goldMin" :max="goldMax" />
          <span class="filter__slider__value">{{goldEnd}}</span>
          <input type="range" class="slider" v-model="goldEnd" :min="goldMin" :max="goldMax" />
        </div>
      </div>
    </div>
    <div class="filter__list">
      <div class="filter__list__head">
        <div>ID</div>
        <div>Name</div>
        <div>Age</div>
        <div>Costs</div>
      </div>
      <div class="filter__list__item" v-for="(list, index) in filterList" :key="index">
        <router-link
          :to="{name: 'list', params: {id: list.id} }"
          v-slot="{ href, route, navigate, isActive }"
        >
          <div class="character">
            <div class="character__info">{{list.id}}</div>
            <a class="character__info" :active="isActive" :href="href">{{ list.name }}</a>
            <div class="character__info">{{list.age}}</div>
            <div class="character__info">
              <span v-if="list.cost.Wood">Wood: {{list.cost.Wood}}</span>
              <span v-if="list.cost.Gold">Gold: {{list.cost.Gold}}</span>
              <span v-if="list.cost.Food">Food: {{list.cost.Food}}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      isLoaded: false,
      items: [],
      costs: [],
      //wood
      woodMin: 0,
      woodMax: 0,
      woodStart: 0,
      woodEnd: 0,
      //gold
      goldMin: 0,
      goldMax: 0,
      goldStart: 0,
      goldEnd: 0,
      //food
      foodMin: 0,
      foodMax: 0,
      foodStart: 0,
      foodEnd: 0,
      //age
      age: "",
      lists: []
    };
  },
  computed: {
    filterList() {
      let vm = this;
      if (vm.lists.length == 0) return vm.lists;

      return vm.lists.filter(item => {
        if (item.cost) {
          let currentItem = item.cost;
          let responseBoolean = false;

          if (vm.foodStart > 0 && currentItem.Food) {
            responseBoolean =
              currentItem.Food >= vm.foodStart &&
              currentItem.Food <= vm.foodEnd;
          } else if (vm.woodMax > 0 && currentItem.Wood) {
            responseBoolean =
              currentItem.Wood >= vm.woodStart &&
              currentItem.Wood <= vm.woodEnd;
          } else if (vm.goldStart > 0 && currentItem.Gold) {
            responseBoolean =
              currentItem.Gold >= vm.goldStart &&
              currentItem.Gold <= vm.goldEnd;
          }

          let age = vm.age ? item.age.toLowerCase() == vm.age : true;

          return responseBoolean && age;
        }
      });
    }
  },
  mounted() {
    this.getList();
  },
  watch: {
    $route(to, from) {
      this.getList();
    }
  },
  methods: {
    getList: function() {
      let vm = this;
      let result = axios.get("/src/data.json").then(response => {
        this.lists = response.data.units;
        this.isLoaded = true;
        this.getMaxMin();
      });
    },
    getMaxMin: function() {
      let vm = this;
      let _woodMax = Math.max(
        ...this.lists
          .filter(item => item.cost && item.cost.Wood)
          .map(item => item.cost.Wood)
      );
      let _woodMin = Math.min(
        ...this.lists
          .filter(item => item.cost && item.cost.Wood)
          .map(item => item.cost.Wood)
      );
      let _goldMax = Math.max(
        ...this.lists
          .filter(item => item.cost && item.cost.Gold)
          .map(item => item.cost.Gold)
      );
      let _goldMin = Math.min(
        ...this.lists
          .filter(item => item.cost && item.cost.Gold)
          .map(item => item.cost.Gold)
      );
      let _foodMax = Math.max(
        ...this.lists
          .filter(item => item.cost && item.cost.Food)
          .map(item => item.cost.Food)
      );
      let _foodMin = Math.min(
        ...this.lists
          .filter(item => item.cost && item.cost.Food)
          .map(item => item.cost.Food)
      );

      //wood mounted
      vm.woodStart = _woodMin;
      vm.woodEnd = _woodMax;
      vm.woodMin = _woodMin;
      vm.woodMax = _woodMax;
      //gold mounted
      vm.goldStart = _goldMin;
      vm.goldEnd = _goldMax;
      vm.goldMin = _goldMin;
      vm.goldMax = _goldMax;
      //food mounted
      vm.foodStart = _foodMin;
      vm.foodEnd = _foodMax;
      vm.foodMin = _foodMin;
      vm.foodMax = _foodMax;
    }
  }
};
</script>
