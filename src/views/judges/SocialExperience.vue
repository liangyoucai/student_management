<template>
  <div class="container">
    <!-- 标题栏 -->
    <h1 class="title">学生社会实践情况 - 在线评审</h1>
    <div class="info-row">
      <div class="info-item">
        <span>待评分学生个数：</span>
        {{ waitingStudents.length }}
      </div>
      <div class="info-item">
        <span>已完成评分个数：</span>
        {{ finishedStudents.length }}
      </div>
      <div class="info-item" v-if="waitingStudents.length > 0">
        <el-button type='text' style="font-size: 1rem;" @click="startOverview">{{ isOverviewing ? '返回评分' : '评分总览' }}</el-button>
      </div>
    </div>
    <el-divider></el-divider>

    <!-- 开始评审按钮 -->
    <div v-if="!isReviewing && !isOverviewing && waitingStudents.length !== 0">
      <el-button type="primary" class="review-btn" @click="startReview">开始评审</el-button>
    </div>

    <!-- 评审卡片 -->
    <div v-if="isReviewing && !isOverviewing">
      <div class="review-card">
        <el-form label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="学号">
                <el-input v-model="currentStudent.id" :readonly=true></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input v-model="currentStudent.name" :readonly=true></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学苑">
                <el-input v-model="currentStudent.class" :readonly=true></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <template v-for="(project, index) in waitingStudents[currentIndex].research">

            <div v-if="index >= 0">
              <h4>参与的社会实践情况{{ index + 1 }}</h4>
            </div>
            <el-row>
              <el-col :span="16">
                <el-form-item label="社会实践名称">
                  <el-input v-model="project.name" :readonly=true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="负责人">
                  <el-input v-model="project.manager" :readonly=true></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="负责单位">
                  <el-input v-model="project.organization" :readonly=true></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="20">
                <el-form-item label="内容">
                  <el-input v-model="project.content" :readonly=true></el-input>
                </el-form-item>
              </el-col>
            </el-row>


            <el-row>

              <el-col :span="20">
                <el-form-item label="成果">
                  <el-input v-model="project.achievement" :readonly=true></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="时长">
                  <el-input v-model="project.time" :readonly=true></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </template>
        </el-form>

        <el-divider></el-divider>
        <div class="block">
          <span class="demonstration">评分：{{ currentScore }}</span>
          <rating-list :currentScore="currentScore" @score-selected="onScoreSelected"></rating-list>
        </div>
      </div>
      <el-button-group>
        <el-button type="primary" class="review-btn" @click="submitScore">下一个</el-button>
        <el-button class="review-btn" @click="cancelReview">返回</el-button>
      </el-button-group>
    </div>

    <!-- 评分标准 -->
    <score-table v-if="waitingStudents.length > 0 && !isOverviewing" :scoreStandard="scoreStandard"></score-table>

    <!-- 待评分人数为0时出现的画面 -->
    <!-- <el-empty v-if="waitingStudents.length == 0 && !isOverviewing" description="暂无需要评分的学生" style="height:70vh;"></el-empty> -->

    <!-- 评分总览表 -->
    <overview-table :allStudents="allStudents.sort((a, b) => a.id - b.id)" v-if="isOverviewing" @review-from-overview="startReviewFromOverview">
      <!-- <el-table-column v-for="(project, index) in research" :key="index" label="科研项目名称" prop="project.name" :show-overflow-tooltip="true">
      </el-table-column> -->

      <el-table-column label="社会实践情况" width="350">
        <template slot-scope="scope">
          <div v-for="(project, index) in scope.row.research" :key="index">{{ '岗位' + (index + 1) + '：' + project.name }}</div>
        </template>
      </el-table-column>

    </overview-table>

    <!-- 确认提交按钮与弹出提示 -->
    <el-button v-if="isOverviewing" type="primary" class="submitSocre-btn" @click="submitAllScores">确认提交</el-button>
    <el-dialog title="提示" :visible.sync="dialog1Visible" width="30%">
      <span>还有{{ waitingStudents.length }}名学生未评分，请评分后再提交！</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialog1Visible = false">取 消</el-button>
                <el-button type="primary" @click="dialog1Visible = false">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialog2Visible" width="30%">
      <span>确认提交？一经提交评分不可撤回。</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialog2Visible = false">取 消</el-button>
                <el-button type="primary" @click="dialog2Visible = false">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import OverviewTable from '@/components/OverviewTable.vue';
import ScoreTable from '@/components/ScoreTable.vue'
import RatingList from '@/components/RatingList.vue';
export default {
  emits: ['score-selected', 'review-from-overview'],
  components: {
    OverviewTable,
    ScoreTable,
    RatingList
  },
  data() {
    return {
      waitingStudents: [
        {
          id: 1,
          name: '张三',
          class: '一班',
          research: [
            {
              name: '义工服务活动',
              manager: '李华',
              organization: '北京大学',
              content:'协助社区义工站进行志愿服务，包括老年人陪伴、环境整治、废品回收等',
              time: '2019年1月-2020年3月',
              achievement: '协助义工站完成50多次志愿服务，获得社区居民认可和表彰'
            },
            {
              name: '夏令营支教',
              manager: '王刚',
              organization: '中央财经大学',
              content:'赴贫困山区开展夏令营教学活动，为当地儿童提供英语、数学、音乐等课程',
              time: '2020年3月-2021年9月',
              achievement: '帮助20多名儿童提高英语、数学、音乐等方面的知识，提高综合素质'
            }
          ],
          score: null
        },
        {
          id: 2,
          name: '李四',
          class: '二班',
          research: [
            {
              name: '公益募捐',
              manager: '王明',
              organization: '北京大学',
              content:'在城市街头、商场等公共场所开展募捐活动，为患有罕见病的患者筹集医疗费用',
              time: '2018年2月-2019年8月',
              achievement: '募集善款100余万元，帮助多名罕见病患者获得救治'
            }
          ],
          score: null
        },
        {
          id: 3,
          name: '王五',
          class: '三班',
          research: [
            {
              name: '农村义教活动',
              manager: '张三丰',
              organization: '复旦大学',
              content:'到贫困农村地区进行义教活动，向当地孩子传授基础知识及健康教育等内容',
              time: '2020年9月-2021年12月',
              achievement: '帮助农村学生提升学习成绩，提高文化素养和健康水平'
            },
            {
              name: '环保公益巡演',
              manager: '李丹',
              organization: '上海交通大学',
              content:'在城市各个街区开展宣传和巡演活动，呼吁市民关注环境保护问题，提倡低碳生活',
              time: '2019年6月-2021年3月',
              achievement: '引起广泛社会关注，促进了市民环保意识的增强，形成良好的环保氛围'
            }
          ],
          score: null
        }],
      finishedStudents: [],
      isReviewing: false,
      isOverviewing: false,
      currentStudent: null,
      currentIndex: null,
      currentScore: null,
      scoreStandard: [
        { score: '10', comment: '表现突出，得到满分评价' },
        { score: '9', comment: '态度端正，工作勤奋' },
        { score: '8', comment: '工作认真，具备普通水平' },
        { score: '7', comment: '存在服务行为上的不足或失误' },
        { score: '6', comment: '工作不认真，存在严重失误或不规范问题' },
        { score: '5及以下', comment: '表现不合格，失职渎职' }
      ],
      dialog1Visible: false,
      dialog2Visible: false,

    };
  },
  computed: {
    allStudents() {
      return [...this.finishedStudents, ...this.waitingStudents];
    }
  },
  methods: {
    startReview() {
      this.isReviewing = true;
      this.isOverviewing = false;
      this.showNextStudent();
    },
    startOverview() {
      this.isReviewing = false;
      this.isOverviewing = !this.isOverviewing;
    },
    showNextStudent() {
      if (this.waitingStudents.length > 0) {
        // 滚动到顶部
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        this.currentStudent = this.waitingStudents[0];
        this.currentIndex = 0;
        this.currentScore = 0;
      } else {
        this.startOverview();
        const h = this.$createElement;
        this.$notify({
          title: '评审完成',
          message: h('i', { style: 'color: teal' }, '确认无误后，点击下方确认提交按钮。')
        });

      }
    },
    onScoreSelected(score) {
      this.currentScore = score;
      // console.log('获取到rating-list组件传递的分数值：', score);
    },
    startReviewFromOverview(id) {
      // 滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // 在等待评分的学生中查找
      let student = this.waitingStudents.find(student => student.id === id);
      if (student) {
        this.startReview();
        this.currentStudent = student;
        this.currentIndex = this.waitingStudents.indexOf(student);
        console.log("currentIndex = " + this.currentIndex);
      }
      // 在已完成评分的学生中查找
      student = this.finishedStudents.find(student => student.id === id);
      if (student) {
        student.score = null;
        this.currentStudent = student;
        this.currentIndex = this.finishedStudents.indexOf(student);
        this.finishedStudents.splice(this.currentIndex, 1);
        this.waitingStudents.push(student);
        this.currentIndex = this.waitingStudents.indexOf(student);
        this.startReview();
      }
    },
    submitScore() {
      this.currentStudent.score = this.currentScore;
      this.finishedStudents.push(this.currentStudent);
      this.currentStudent = null;
      this.waitingStudents.splice(this.currentIndex, 1);
      console.log(this.waitingStudents);
      console.log(this.finishedStudents);
      this.showNextStudent();
    },
    cancelReview() {
      this.currentStudent = null;
      this.isReviewing = false;
    },

    submitAllScores() {
      if (this.waitingStudents.length > 0) {
        this.dialog1Visible = true;
      } else {
        this.dialog2Visible = true;
      }
    }
  }





};
</script>

<style scoped>
.container {
  margin: 10px auto;
  max-width: 900px;
  /* height: 100%; */
}

.title {
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}

.studentInfo {
  margin: 0 auto;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item {
  font-size: 16px;
  color: #666;
}

.el-divider--horizontal {
  margin-top: 3px;
}

.review-card {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 30px;
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.card-item {
  font-size: 16px;
  color: #666;
  margin-right: 20px;
}

.submitSocre-btn {
  margin-top: 50px;
}



.el-button-group {
  margin-top: 30px;
  text-align: center;
}

.review-btn {
  width: 120px;

}

.submitSocre-btn {
  margin-top: 50px;
}

.info-btn {
  margin-left: 30px;
}



.empty {
  color: #999;
}
</style>