<template>
  <v-layout class="rounded rounded-md">
    <v-main>
      <v-sheet
        class="d-flex justify-center align-center"
        height="100vh"
        width="100vw"
        color="transparent"
      >
        <slot />
      </v-sheet>
    </v-main>
  </v-layout>
</template>

<style>
/* Scrollbar */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: rgba(30, 30, 30, 1);
}

::-webkit-scrollbar-thumb {
  background-color: #5b5b5b;
  animation: hoverAnimationToScroll .2s reverse;
  padding: 20px;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(22, 150, 182, .7);
  animation: hoverAnimationToScroll 1s normal;
  padding: 20px;
  border-radius: 20px;
}
.v-toolbar__content, .v-toolbar__extension {
  padding: 0px !important;
}
</style>
