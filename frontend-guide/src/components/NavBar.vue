<template>
  <div class="d-flex h-100 align-center">
    <div class="d-flex align-center">
      <VIcon icon="mdi-home-outline"></VIcon>
      <VIcon icon="mdi-chevron-right"></VIcon>
      <span class="nav-bar-title"> {{ $route.name }} </span>
    </div>
  </div>
</template>
<script setup>

</script>
<style lang="scss">
.nav-bar-title {
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
}
</style>
