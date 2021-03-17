<template>
    <div id="wrapper">
        <v-container>

                    <h1 class="display-2 font-weight-bold mb-3">
                        Cheer
                    </h1>

        </v-container>
  </div>
</template>
<script>
// import logger from "electron-log"
export default {
  name: 'cheer-page',
  data () {
    return {
      cheerUrl: '',
      imgwidth: 700,
      imgheight: 390
    }
  },
  created: function () {
    // logger.info('created')
  },
  mounted () {
    // logger.info('mounted')
  },
  methods: {
  },
  beforeDestroy () {

  }
}
</script>
<style>
  /* #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  } */
</style>
