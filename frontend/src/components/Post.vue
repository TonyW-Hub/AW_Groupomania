<template>
    <div class="container-fluid">
        <div class="row mx-auto mb-5">
            <div class="post col-9 col-md-8 col-lg-6 mx-auto bg-primary py-2 shadow">
                <slot name="Posts"></slot>
                <slot name="Comments"></slot>
                <slot name="EditCom"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Post",

    data() {
        return {}
    },
}
</script>

<style lang="scss" scoped>
.post {
    border-radius: 1.7rem;
}
</style>