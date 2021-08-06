<template>
    <div class="pt-3 pb-5">
        <div class="card col-8 col-lg-4 mx-auto bg-white py-4 shadow border-primary">
            <h3 class="text-primary mt-3">Me connecter</h3>
            <form id="form" class="mt-5" @submit.prevent="login()" method="post" novalidate="true">
                <div class="form-group form-group-sm" :class="{ 'form-group--error': $v.email.$error }">
                    <div class="col mx-auto position-relative">
                        <label for="email"></label>
                        <div class="d-flex justify-content-center input-group">
                            <span class="icon position-absolute input-group-addon">
                                <i class="fas fa-envelope text-secondary"></i>
                            </span>
                            <input id="email" class="col-7 col-lg-7 form-control form-control-sm rounded border-primary" name="email" type="email" placeholder="Email" v-model.trim="$v.email.$model" @change="activatedBtn()">                            
                        </div>
                    </div>
                    <span class="badge badge-danger" v-if="!$v.email.email">Un email est demandé</span>
                </div>
                    <div class="form-group form-group-sm" :class="{ 'form-group--error': $v.password.$error }">
                        <div class="col mx-auto position-relative">
                            <label for="password"></label>
                            <div class="d-flex justify-content-center input-group">
                                <span class="icon position-absolute input-group-addon">
                                    <i class="fas fa-lock text-secondary"></i>
                                </span>
                                <input id="password" class="col-7 col-lg-7 form-control form-control-sm rounded border-primary" name="password" type="password" placeholder="Mot de passe" v-model.trim="$v.password.$model" @change="activatedBtn()">
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm mt-3" :disabled="isActive" type="submit" @click.prevent="login">Connexion</button>
            </form>
            <b-alert v-if="errorAlert" show dismissible variant="danger" class="col-10 mx-auto mt-5">Identifiants incorrects</b-alert>
            <div class="mt-5 pt-5">
                <p class="pb-1"> Vous n'avez pas encore de compte ? Inscrivez-vous !</p>
                <button class="btn btn-dark btn-sm" @click.prevent="goSignin" >Inscription</button>
            </div>
        </div>
    </div>
</template>


<script>
import {email,required,minLength} from "vuelidate/lib/validators";
import axios from "axios";


export default {
name: 'login',
data() {
    return {
        email: "",
        password: "",
        submited: false,
        isActive: true,
        errorAlert: false
    }
    },

validations: {
    email: {
        email,
        required
    },
    password: {
        required,
        minLength: minLength(8)
    }
},
methods:{

    activatedBtn() {
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        if (email !== null && password !== null){
            this.isActive = false
        }
    },

    login() {
        this.errorAlert = false; // reboot alert before each try

    axios.post( 'http://localhost:3000/api/users/login', {
        email: this.email,
        password: this.password,
        })
        .then((res) => {
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("userId", res.data.userId)
            localStorage.setItem("isAdmin", res.data.isAdmin)
            this.$router.push('/allpost');
        })
        .catch(() => {
            this.errorAlert = true
        })
    },

    goSignin(){
        this.$router.push('Signup');
    }
}
}
</script>

<style scoped>
.card {
    border-radius: 2rem;
}
.btn {
    margin-bottom: 20px;
    font-weight: bold;
}
.icon {
    left: 10%;
    font-size: 21px;
}
</style>



