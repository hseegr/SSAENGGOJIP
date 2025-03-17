<template>
  <VSheet class="rounded v-theme--dark" elevation="1">
    <code class="language-html">
      <span class="token tag">
        <span class="token punctuation">&lt;</span>{{ tag.name }}<span v-for="(value, key) in attr" :key="key">
          <span class="token attr-name">&nbsp;{{ key }}</span>
          <span class="token attr-value">
            <span class="token punctuation attr-equals">=</span>
            <span class="token punctuation">"{{ value }}"</span>
          </span>
        </span>
        <span class="token punctuation">&gt;</span>
      </span>
      <span v-if="tag.text">{{ tag.text }}</span>
      <span class="token tag">
        <span class="token punctuation">&lt;/</span>{{ tag.name }}<span class="token punctuation">&gt;</span>
      </span>
    </code>
  </VSheet>
</template>
<script setup>
const props = defineProps({
  tag: {
    type: Object,
    required: true,
  },
  attr: {
    type: Object,
    required: false,
  }
})
</script>
<style lang="scss" scoped>
.v-sheet {
  padding: 16px;
  padding-inline-end: 48px;
  margin-bottom: 40px;

  .language-html {
    white-space: pre-wrap;

    .token {
      &.tag {
        color: #e2777a;
      }

      &.punctuation {
        color: #ccc;
      }
    }
  }
}
</style>
