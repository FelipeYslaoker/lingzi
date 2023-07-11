<template>
  <div>
    <lingzi-card title="" class="ma-3" padding="pa-0" overflow-x>
      <item-category-content :category="category" />
    </lingzi-card>
  </div>
</template>

<script setup lang="ts">
import { LingziLanguageCategory } from '@/@types/Lingzi/Language'

defineProps({
  category: {
    type: Object,
    default () {
      return {} as LingziLanguageCategory
    }
  }
})
</script>
