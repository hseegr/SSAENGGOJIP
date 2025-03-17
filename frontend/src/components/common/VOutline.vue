<script lang="ts" setup>
defineProps<{
  title?: string,
}>();
</script>

<template>
  <div class="outline">
    <div class="header">
      <div v-if="title" class="label">{{ title }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.outline {
  border: 1px solid rgb(180, 180, 180);
  border-radius: 4px;
  
  .header {
    height: 16px;
    margin-top: -10px;
    margin-left: 12px;
    
    width: fit-content;
    font-size: 12px;
    background: white;
    color: rgba(0, 0, 0, 0.8);
    
    .label {
      margin: 0px 4px;
      opacity: 0.6;
      user-select: none;
    }
  }
}
</style>
