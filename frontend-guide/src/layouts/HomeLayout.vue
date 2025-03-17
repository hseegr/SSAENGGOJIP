<template>
  <div class="layout-wrapper">
    <!-- 👉 Vertical Nav -->
    <NavDrawer></NavDrawer>
    <div class="layout-content-wrapper">
      <header class="layout-navbar">
        <div class="navbar-content-container">
          <!-- 👉 NavBar -->
          <NavBar/>
        </div>
      </header>
      <VDivider></VDivider>
      <!-- 👉 View(Page) -->
      <main class="layout-view">
        <div class="view-content-container">
          <router-view/>
        </div>
      </main>
      <footer class="layout-footer">
        <div class="footer-content-container">
          <!-- 👉 Footer -->
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import NavDrawer from "@/components/NavDrawer.vue";
</script>

<style lang="scss">
.layout-wrapper {
  padding-inline: 3rem;

  .layout-content-wrapper {
    .navbar-content-container {
      block-size: 64px;
    }

    .layout-view {
      padding-block: 1rem;
    }
  }
}
</style>
