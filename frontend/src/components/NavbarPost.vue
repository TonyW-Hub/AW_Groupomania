<template>
    <div class="container-fluid px-0">
        <nav class="Navbar">
            <b-navbar toggleable="md" type="dark" variant="secondary" class="py-2 navRounded">
                <a href="/allpost"><img class="navbar-brand img-fluid logo" src="../assets/icon-left-font-monochrome-white copy.svg" aria-label="logo groupomania" alt="Logo groupomania"></a>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <div class="d-flex justify-content-end align-items-center">
                            <b-nav-item v-if="isAllpost" id="Accueil" size="sm" class="mr-3"><router-link to="/allpost" class="nav-link">Accueil</router-link></b-nav-item>
                            <b-nav-item v-if="isPost" size="sm" class="mr-3"><router-link to="/addpost" class="nav-link">Poster</router-link></b-nav-item>
                            <b-nav-item v-if="isProfile" size="sm" class="mr-3"><router-link to="/profile" class="nav-link">Mon Compte</router-link></b-nav-item>
                            <b-nav-item size="sm" class="mr-2 btn btn-info logOut"  @click="logout" >Déconnexion</b-nav-item>
                        </div>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </nav>
    </div>
</template>

<script>
export default {
    // Check if the current page is allpost and hide the "Acceuil" button now useless
    created: function() {
    if (window.location.pathname === '/allpost') {
            this.isAllpost = false
        } else if (window.location.pathname === '/profile') {
            this.isProfile = false
        } else if (window.location.pathname === '/addpost') {
            this.isPost = false
        }
    },

    data() {
        return {
            isAllpost: true,
            isProfile: true,
            isPost: true
        }
    },
    name: 'NavbarPost',
    methods: {
    logout () {
        localStorage.removeItem('token')
        localStorage.removeItem('pseudo')
        localStorage.removeItem('userId')

        this.$router.push('/login')
    },
},


}

</script>

<style scoped>
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
.logOut {
    border-radius: 3rem;
}
</style>