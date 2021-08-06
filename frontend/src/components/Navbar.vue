<template>
    <div class="Navbar">
        <b-navbar toggleable="md" type="dark" variant="secondary" class="py-3 navRounded">
            <a href="/"><img class="img-fluid logo" src="../assets/icon-left-font-monochrome-white.svg" aria-label="logo groupomania" alt="Logo groupomania"></a>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: 'Navbar',
    user: false
}
</script>

<style lang="scss" scoped>
.navRounded {
    border-bottom-left-radius: 1.7rem;
    border-bottom-right-radius: 1.7rem;
}
.navbar-dark .navbar-nav .nav-link {
    color: white;
}
.logo {
    max-height: 80px;
    max-width: 170px;
}
</style>