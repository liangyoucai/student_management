<template>
    <div class="rating-list">
        <el-button style="width: 2.5rem; display: flex; justify-content: center; border-radius: 50%;" v-for="index in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="index" :class="{ active: index === currentScore }" @click="selectScore(index)">{{ index }}</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentScore: 0
        }
    },
    methods: {
        selectScore(score) {
            this.currentScore = score;
            this.$emit('score-selected', score)
        }
    }
}
</script>

<style scoped>
.rating-list {
    display: flex;
    width: 80%;
    margin: 0 auto;
    margin-top: 15px;
    justify-content: space-evenly;

}

/* .el-button{
    margin-right: 10px;
} */
.active {
    background-color: #409EFF;
    color: #fff;
}
</style>