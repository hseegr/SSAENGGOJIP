<template>
  <h2>Usage</h2>
  <v-sheet class="usage rounded">
    <v-toolbar density="compact" rounded>
      <v-slide-group>
        <v-slide-group-item>
          <v-btn-toggle class="usage-toolbar" variant="text" v-model="toggle" mandatory>
            <v-btn v-for="(item, index) in component.toolbarItems" :key="index" size="small"
                   class="usage-toolbar-item" :value="item.value">
              {{ item.title }}
            </v-btn>
          </v-btn-toggle>
        </v-slide-group-item>
      </v-slide-group>
    </v-toolbar>
    <div class="usage-example">
      <div class="usage-component">
        <Component class="usage-component" :is="component.tag.object"
                   v-bind="{...component.tag.value,...toggle,...selected}">
          <slot/>
        </Component>
      </div>
      <div class="usage-checkbox">
        <v-list>
          <v-list-item>
            <v-checkbox v-for="(item, index) in component.checkboxItems" :key="index"
                        v-model="selected"
                        class="usage-checkbox-item" hide-details
                        :label="item.title"
                        :value="item.value"></v-checkbox>
          </v-list-item>
        </v-list>
      </div>
    </div>
    <CodeSnippet :tag="component.tag" :attr="{...component.tag.value,...toggle, ...selected}"></CodeSnippet>
  </v-sheet>
</template>
<script setup>
import CodeSnippet from "@/components/CodeSnippet.vue";
import {ref} from "vue";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  }
});
const toggle = ref();
const selected = ref();

</script>
<style lang="scss">
.usage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  .v-toolbar {
    .usage-toolbar {
      padding: 10px;

      &-item {
        text-transform: none !important;
      }
    }
  }

  .usage-example {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;

    .usage-component {
      flex-grow: 1;
      padding: 10px;
    }
  }

  .v-selection-control__wrapper {
    display: block !important;
  }

  .v-btn--active {
    &.v-btn__overlay {
      opacity: calc(var(--v-activated-opacity) * var(--v-theme-overlay-multiplier));
    }
  }
}
</style>
