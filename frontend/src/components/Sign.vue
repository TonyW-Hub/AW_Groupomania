<template>
    <div class="pt-3 pb-5">
        <div class="card col-8 col-lg-5 mx-auto bg-white py-4 shadow border-primary">
            <h1 class="h3 text-primary mt-3">Créer un compte</h1>
            <form id="form" class="mt-3 mb-4" @submit.prevent="signup()" method="post" novalidate="true">
                <div class="form-group form-group-sm" :class="{ 'form-group--error': $v.pseudo.$error }">
                    <div class="col mx-auto position-relative">
                        <label for="pseudo">Pseudo</label>
                        <div class="d-flex justify-content-center input-group">
                            <span class="icon position-absolute input-group-addon">
                                <i class="fas fa-user text-secondary"></i>
                            </span>
                            <input id="pseudo" name="pseudo" type="text" class="col-7 col-lg-6 form-control form-control-sm rounded border-primary" v-model.trim="$v.pseudo.$model">
                        </div>
                        <span class="badge badge-danger" v-if="!$v.pseudo.minLength">{{$v.pseudo.$params.minLength.min}} caractères min !</span>
                    </div>
                </div>
                <div class="form-group form-group-sm" :class="{ 'form-group--error': $v.email.$error }">
                    <div class="col mx-auto position-relative">
                        <label for="email">Email</label>
                        <div class="d-flex justify-content-center input-group">
                            <span class="icon position-absolute input-group-addon">
                                <i class="fas fa-envelope text-secondary"></i>
                            </span>
                            <input id="email" name="email" type="email" class="col-7 col-lg-6 form-control form-control-sm rounded border-primary" placeholder="exemple@exemple.com" v-model.trim="$v.email.$model">
                        </div>
                    </div>
                </div>
                <div class="form-group form-group-sm" :class="{ 'form-group--error': $v.password.$error }">
                    <div class="col mx-auto position-relative">
                        <label for="password">Mot de passe</label>
                        <div class="d-flex justify-content-center input-group">
                            <span class="icon position-absolute input-group-addon">
                                <i class="fas fa-lock text-secondary"></i>
                            </span>
                            <input id="password" name="password" type="password" class="col-7 col-lg-6 form-control form-control-sm rounded border-primary" v-model.trim="$v.password.$model">
                        </div>
                        <span class="badge badge-danger mt-1" v-if="!$v.password.minLength">{{$v.password.$params.minLength.min}} caractères minimum,<br> avec une majuscule un caractère numérique et un caractère spécial.</span>
                    </div>
                </div>
                <div class="form-group form-group-sm">
                    <div class="col mx-auto position-relative">
                        <label for="confirmPassword">Confirmation</label>
                        <div class="d-flex justify-content-center input-group">
                            <span class="icon position-absolute input-group-addon">
                                <i class="fas fa-lock text-secondary"></i>
                            </span>
                            <input id="confirmPassword" name="confirmPassword" type="password" class="col-7 col-lg-6 form-control form-control-sm rounded border-primary" v-model.trim="$v.confirmPassword.$model">
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm mt-3" type="submit" @click.prevent="signup">S'inscrire</button>
            </form>
            <div>
                <!-- alert from axios'response -->
                <b-alert v-if="blankFields" show dismissible variant="danger">Veuillez compléter tous les champs</b-alert>
                <b-alert v-if="this.alert == 400" show dismissible variant="danger">Veuillez respecter le format des champs</b-alert>
                <b-alert v-if="this.alert == 409" show dismissible variant="danger">Pseudo ou Email déjà utilisé</b-alert>
                <b-alert v-if="this.alert == 500" show dismissible variant="danger">Une erreur est survenue</b-alert>
                <b-alert v-if="differentConfirmPassword" show dismissible variant="danger">Les mots de passe sont différents</b-alert>
            </div>
            <div class="pt-5">
                <p class="pb-1"> Vous avez déjà un compte ? Connectez-vous !</p>
                <button class="btn btn-secondary btn-sm" @click.prevent="goLogin">Connexion</button>
            </div>
        </div>
    </div>
</template>


<script>
import {required, minLength, email} from "vuelidate/lib/validators";
import axios from "axios";

export default {
    name: 'signup',

    data() {
        return {
            pseudo: "",
            email: "",
            password: "",
            confirmPassword: "",
            submited: false,
            blankFields: false,
            differentConfirmPassword: false,
            alert: []
        }
    },

    validations: {
        pseudo: {
            required,
            minLength: minLength(5)
        },
        email: {
            required,
            email
        },
        password: {
            required,
            minLength: minLength(8)
        },
        confirmPassword: {
            required,
        },
    },

    methods: {

        goLogin(){
            this.$router.push('Login');
        },

        signup() {
            this.blankFields = false
            this.differentConfirmPassword = false
            this.alert = [0];

            if (!this.email && !this.password && !this.pseudo && !this.confirmPassword) {
                this.blankFields = true
            } else {
                if(this.password == this.confirmPassword) {
                    this.$v.$touch() // checks for errors
                    this.submited = true
                    axios
                        .post( 'http://localhost:3000/api/users/signup', {
                            pseudo: this.pseudo,
                            email: this.email,
                            password: this.password,
                        })
                        .then(() => {
                            alert('Compte créé avec succès')
                            localStorage.setItem('pseudo', this.pseudo)
                            this.$router.push('Login')
                        })
                        .catch((error) => {
                            console.log(error)
                            if(error.response){
                                this.alert = error.response.status;
                            }
                        })

                } else {
                    this.differentConfirmPassword = true
                }
            }
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



