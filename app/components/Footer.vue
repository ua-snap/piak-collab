<template>
  <footer class="footer">
    <h3 class="title is-3">Hi everybody! Footers are for giving credit.</h3>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const year = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  text-align: center;
  padding-bottom: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #dbdbdb;
  color: #5a4f72;
}
</style>
