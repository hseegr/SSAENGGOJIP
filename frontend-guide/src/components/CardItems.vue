<template>
  <VRow>
    <VCol v-for="(card, index) in cards" :key="index" cols="12" :md="card.md?card.md:3">
      <VCard
        :append-icon="card.appendIcon"
        :class="card.class"
        :to="card.to"
        :href="card.href"
        :target="card.href?'_blank':''"
        :prepend-icon="card.prependIcon"
        :title="card.title"
        :subtitle="card.subtitle"
      >
        <VImg :src="card.src"></VImg>
      </VCard>
    </VCol>
  </VRow>
</template>
<script setup>
const props = defineProps({
  cards: {
    type: Object,
    required: true,
  }
})
</script>
