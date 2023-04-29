<template>
    <div class="score-table">
        <h3>评分标准</h3>
        <table>
            <thead>
                <tr>
                    <th>分数</th>
                    <th>评价</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in scoreStandard" :key="item.score">
                    <td>{{ item.score }}</td>
                    <td>{{ item.comment }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props:['scoreStandard']
}
</script>

<style scoped>
.score-table {
    max-width: 500px;
    margin: 20px auto;
    margin-top: 40px;
    margin-bottom: 40px;

}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

td,
th {
    padding: 10px;
    border: 1px solid #ccc;
}

th {
    background-color: #f8f8f8;
    font-weight: normal;
    text-align: left;
}

.score {
    font-weight: bold;
    color: #ff9900;
}

.score-row {
    display: flex;
    justify-content: flex-end;
}

.score-item {
    font-size: 16px;
    color: #666;
}
</style>