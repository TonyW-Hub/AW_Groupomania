<template>
    <div class="container-fluid">
        <div class="card col-8 mx-auto cardProfile shadow border-primary">
            <div class="row">
                <div class="col-8 mx-auto my-4">
                    <div class="d-flex justify-content-center align-items-center">
                        <b-img id="imgProfile" class="rounded-circle border border-primary" :src="user.imageUrl" fluid></b-img>
                        <h1 class="ml-2 align-self-end px-3 pb-3 text-secondary">{{ user.pseudo}}</h1>
                    </div>
                    <!-- <hr class="line w-75"> -->
                </div>
            </div>

            <div class="form-group mt-4">
                <div class="row">
                    <div class="col-10 mx-auto mb-3">
                        <b-link v-b-toggle.newPassword class="btn btn-info font-weight-bold px-2 mr-4">Modifier mes infos</b-link>
                        <b-collapse id="newPassword">
                            <form class="card col col-lg-8 mx-auto bg-info py-4 mb-2" @submit.prevent="updateProfile" enctype="multipart/form-data">
                                <div class="form-group mt-3">
                                    <label for="image" class="font-weight-bold btn btn-light">Modifier mon image</label>
                                    <input type="file" name="image" id="image" ref="image" v-on:change="handleFileUpload()"/>
                                    <span class="text-center font-weight-bold">{{ image.name }}</span>
                                    <div class="form-group form-group-sm" :class="{ 'form-group--error': $v.pseudo.$error }">
                                        <div class="col mx-auto position-relative">
                                            <label for="pseudo"></label>
                                            <div class="d-flex justify-content-center input-group">
                                                <span class="icon position-absolute input-group-addon">
                                                    <i class="fas fa-user text-light"></i>
                                                </span>
                                                <input id="pseudo" name="pseudo" type="text" class="col-7 col-lg-6 form-control form-control-sm" v-model.trim="$v.pseudo.$model" :placeholder="user.pseudo">
                                            </div>
                                            <span class="badge badge-danger" v-if="!$v.pseudo.minLength">{{$v.pseudo.$params.minLength.min}} caractères min !</span>
                                        </div>
                                    </div>
                                    <div class="form-group form-group-sm" :class="{ 'form-group--error': $v.email.$error }">
                                        <div class="col mx-auto position-relative">
                                            <label for="email"></label>
                                            <div class="d-flex justify-content-center input-group">
                                                <span class="icon position-absolute input-group-addon">
                                                    <i class="fas fa-envelope text-light"></i>
                                                </span>
                                                <input id="email" name="email" type="email" class="col-7 col-lg-6 form-control form-control-sm" v-model.trim="$v.email.$model" :placeholder="user.email">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group form-group-sm" :class="{ 'form-group--error': $v.password.$error }">
                                        <div class="col mx-auto position-relative">
                                            <label for="password"></label>
                                            <div class="d-flex justify-content-center input-group">
                                                <span class="icon position-absolute input-group-addon">
                                                    <i class="fas fa-lock text-light"></i>
                                                </span>
                                                <input id="password" name="password" type="password" class="col-7 col-lg-6 form-control form-control-sm" v-model.trim="$v.password.$model" placeholder="Mot de passe">
                                            </div>
                                            <span class="badge badge-danger" v-if="!$v.password.minLength">{{$v.password.$params.minLength.min}} caractères minimum,<br> avec une majuscule un caractère numérique et un caractère spécial.</span>
                                        </div>
                                    </div>
                                    <div class="form-group form-group-sm">
                                        <div class="col mx-auto position-relative">
                                            <label for="confirmPassword"></label>
                                            <div class="d-flex justify-content-center input-group">
                                                <span class="icon position-absolute input-group-addon">
                                                    <i class="fas fa-lock text-light"></i>
                                                </span>
                                                <input id="confirmPassword" name="confirmPassword" type="password" class="col-7 col-lg-6 form-control form-control-sm" v-model.trim="$v.confirmPassword.$model" placeholder="Confirmation">
                                            </div>
                                        </div>
                                    </div>
                                    <button v-b-toggle.newPassword class="btn btn-secondary btn-sm mt-3" type="submit">Valider</button>
                                </div>
                            </form>
                        </b-collapse>
                        <b-link class="btn btn-primary font-weight-bold px-3" to="Addpost">Rédiger un post</b-link>
                    </div>
                </div>
                <div class="row">
                    <div class="col-8 mx-auto my-5">
                        <b-link v-if="this.user.isAdmin == 1" class="font-weight-bold py-1 mr-2 btn btn-warning btn-sm" to="AllProfiles">Consulter les profiles</b-link>
                        <b-link class="font-weight-bold py-1 btn btn-danger btn-sm" @click.prevent="deleteUser">Supprimer mon compte</b-link>
                    </div>
                </div>
            </div>


            <b-alert v-if="errorInputs" show dismissible variant="danger">Pseudo ou Email déjà utilisé</b-alert>
            <b-alert v-if="confirmUpdate" show dismissible variant="success">Profil mis à jour</b-alert>
            <b-alert v-if="errorDelete" show dismissible variant="danger">Une erreur est survenue. Veuillez contacter un administrateur</b-alert>
            <b-alert v-if="differentConfirmPassword" show dismissible variant="danger">Les mots de passe sont différents</b-alert>
        </div>
    </div>
</template>

<script>
import {minLength, email} from "vuelidate/lib/validators";
import axios from "axios";


export default {
    name: 'profile',

    async created() {
        await axios
                .get('http://localhost:3000/api/users/profile', {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Bearer " + this.token,
                },
                })
                .then((response) => {
                    this.user = response.data
                    console.log(response);
                })
                .catch(e => {
                    console.log(e + "User inconnu");
                    this.$router.push('/login');
                })
    },

    data() {
        return {
            user: [],
            token: localStorage.getItem('token'),
            userId: parseInt(localStorage.getItem('userId')),

            pseudo: "",
            email: "",
            password: "",
            confirmPassword: "",
            image: "",
            isAdmin: "",

            submited: false,
            isActive: false,
            errorInputs: false,
            confirmUpdate: false,
            errorDelete: false,
            differentConfirmPassword: false,
        }
    },

    validations: {
        pseudo: {
            minLength: minLength(5)
        },
        email: {
            email
        },
        password: {
            minLength: minLength(8)
        },
        confirmPassword: {
        },
    },

    methods:{
        handleFileUpload(){
            this.image = this.$refs.image.files[0];
            this.user.imageUrl = URL.createObjectURL(this.image) // replace the user image by the one uploaded

        },

        updateProfile() {
            this.$v.$touch();

            this.errorInputs = false;
            this.errorDelete = false;
            this.differentConfirmPassword = false;

            // Checks if password input is filled
            if(this.password !== null) {
                // Checks if both matches
                if(this.password !== this.confirmPassword) {
                    // Throw error if not
                    this.differentConfirmPassword = true

                // Send the request if OK
                } else {
                    const formData = new FormData();

            if (this.image) {
                    formData.append("image", this.image);
                    formData.append("userId",this.userId);
                    formData.append("pseudo", this.pseudo);
                    formData.append("email", this.email);
                    formData.append("password", this.password);
            } else {
                    formData.append("userId", this.userId);
                    formData.append("pseudo", this.pseudo);
                    formData.append("email", this.email);
                    formData.append("password", this.password);
                }

            axios
                .put(`http://localhost:3000/api/users/${this.userId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": 'Bearer ' + this.token
                    }
                })
                .then(() => {
                    localStorage.setItem('pseudo', this.pseudo)
                    this.confirmUpdate = true
                    this.$router.go()
                })
                .catch(() => {
                    this.errorInputs = true
                })
                }

            // If password input is not filled,
            } else { // send the request with other inputs

                const formData = new FormData();
                // If there is an image uploaded :
                if (this.image) {
                        formData.append("image", this.image);
                        formData.append("userId",this.userId);
                        formData.append("pseudo", this.pseudo);
                        formData.append("email", this.email);
                        formData.append("password", this.password);
                // if not :
                } else {
                        formData.append("userId", this.userId);
                        formData.append("pseudo", this.pseudo);
                        formData.append("email", this.email);
                        formData.append("password", this.password);
                    }

                axios
                    .put(`http://localhost:3000/api/users/${this.userId}`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": 'Bearer ' + this.token
                        }
                    })
                    .then(() => {
                        localStorage.setItem('pseudo', this.pseudo)
                        this.confirmUpdate = true
                        this.$router.go()
                    })
                    .catch(() => {
                        this.errorInputs = true
                        this.$router.go()
                    })
            }
        },

        deleteUser() {
            axios
                .delete(`http://localhost:3000/api/users/${this.userId}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": 'Bearer ' + this.token
                    }
                })
                .then(res => {
                    console.log(res);
                    alert("Votre compte à bien été supprimé !");
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("pseudo");
                    this.$router.push('/signup');
                })
                .catch(error => (console.log('cannot delete user ' + error )))
        }
    }
}
</script>

<style>
.cardProfile {
    border-radius: 1.7rem;
}
#imgProfile {
    height: 100px;
    width: 100px;
}
#image {
   opacity: 0;
   position: absolute;
   z-index: -1;
}
.icon {
    left: 10%;
    font-size: 21px;
}
</style>