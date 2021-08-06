<template>
	<div class="sticky d-flex justify-content-start">
        <div class="col-2">
            <span class="d-inline-block" tabindex="0" data-toggle="tooltip" data-placement="top" title="Créer un Post" aria-label="Add post logo">
                <router-link to="/addpost">
                    <i class="far fa-comment bg-primary text-white rounded-circle plus p-2"></i>
                </router-link>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CreatePostBtn',
}
</script>

<style lang="scss" scoped>
.plus {
    font-size: 2rem;
    &:hover{
		transform: scale(1.05);
		box-shadow: 0px 0px 30px -10px rgb(107, 107, 107) ;
	}
}
.sticky {
	position: sticky;
	top: 25vh;
	left: 10px;
}
</style>