<template>
  <div class="min-vh-100 d-flex flex-column justify-content-between position-relative">
    <Navbar />
    <HomePage />
    <Log />
    <Footer />
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar.vue'
  import HomePage from '@/components/HomePage.vue'
  import Log from '@/components/Log.vue'
  import Footer from '@/components/Footer.vue'

  export default {
    name: 'Home',
    components: {
      Navbar, HomePage, Log, Footer
    }
  }
</script>