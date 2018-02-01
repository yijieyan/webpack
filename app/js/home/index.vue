<template>
    <div :class="$style.content">
        {{msg}}
        <h4>123123</h4>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data () {
            return {
                msg: 'hello'
            }
        }
    }
</script>

<style lang="scss" module>
    @import '../../css/reset.scss';
    .content {
        font-size: 100px;
        color: #000;
        >h4 {
            color: blue;
        }
    }
</style>

