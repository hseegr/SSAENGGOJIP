<template>
  <section v-for="(section, index) in sections" :key="index" :id="section.id">
    <h2 class="section-title">{{ section.title }}</h2>
    <p class="section-subtitle">{{ section.subtitle }}</p>
    <CardItems :cards="section.cards"></CardItems>
  </section>
</template>
<script setup>
import CardItems from "@/components/CardItems.vue";

const props = defineProps({
  sections: {
    type: Object,
    required: true,
  }
});
</script>
<style lang="scss">
h2, p {
  margin-bottom: 10px;
}

section {
  margin-bottom: 40px;
}
</style>
