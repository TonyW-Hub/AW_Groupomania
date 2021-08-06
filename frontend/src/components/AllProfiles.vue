<template>
    <div class="container-fluid">
        <div class="row mx-auto">
            <div class="col col-md-8 mx-auto bg-primary contentRounded shadow-sm">
                <slot name="AllUsers"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AllUsers",

    data() {
        return {}
    },
}
</script>

<style scoped>
.contentRounded {
    border-radius: 1.7rem;
}
</style>