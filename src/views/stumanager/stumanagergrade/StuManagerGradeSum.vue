<template>
  <div class="container">

    <div class="title">
      <h1 class="title">学生评分汇总 - 已测评</h1>

    </div>
    <el-divider></el-divider>

    <div class="main">
      <!-- 导出Excel -->
      <el-button style="float: left; margin-top: 10px; margin-bottom: 15px;"
      @click="exportClick" type="primary" size="small" icon="el-icon-folder-opened">导出</el-button>
      <el-button
          style="float: left; margin-top: 10px; margin-bottom: 15px;"
          size="small"
          type="danger"
          @click="handleDelete()" icon="el-icon-delete">打回</el-button>

      <el-input 
      style="float: right; margin-left: 20px; margin-top: 10px; margin-bottom: 15px;width: 30%;"
      v-model="searchContent" 
      size="medium" 
      placeholder="请输入姓名或学号" 
      ></el-input>
      <el-table 
      :data="pagedData" 
      style="width: 100%" 
      id="mainTable" 
      max-height="500"
      :row-key="row => row.num"
      ref="multipleTable"
        @select="handleSelect"
        @select-all="handleSelectionAll"
        >
        //选择框
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column prop="no" label="序号" width="50">
          <template slot-scope="scope">
            {{ pageSize * (currentPage - 1) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新日期" width="110" sortable> </el-table-column>
        <el-table-column prop="num" label="学号" width="100" sortable>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="90">
        </el-table-column>
        <el-table-column prop="gpa" label="GPA" width="80" sortable>
        </el-table-column>
        <el-table-column prop="vol" label="志愿" width="80" sortable>
        </el-table-column>
        <el-table-column prop="sci" label="科研" width="80" sortable>
        </el-table-column>
        <el-table-column prop="pra" label="实践" width="80" sortable>
        </el-table-column>
        <el-table-column prop="ser" label="学生骨干" width="100" sortable>
        </el-table-column>
        <el-table-column prop="per" label="个人总结" width="100" sortable>
        </el-table-column>
        <el-table-column prop="totalpoints" label="测评总分" width="80" sortable>
        </el-table-column>

      </el-table>

      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="checklist.length"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      />


    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import qs from 'qs';
import parseTime from "@/utils/timeformat"
import summary from '@/api/studentManager/summary';

export default {
  data() {
    return {
      tableData: [{
        updateTime: "",
        num: "",
        name: "",
        gpa: "",
        vol: "",
        sci: "",
        pra: "",
        ser: "",
        per: "",
        totalpoints:""
      }],
      checklist: [{
        updateTime: "",
        num: "",
        name: "",
        gpa: "",
        vol: "",
        sci: "",
        pra: "",
        ser: "",
        per: "",
        totalpoints:""
      }],//筛选值
      searchContent:'',// 搜索内容
      selected: [], // 多选框选中的数据
      searchContent:'',
      pageSize: 3, // 每页显示的数据条数
      currentPage: 1, // 当前页数
      deleteTable:[]
    };
  },

  mounted() {
    this.init();
  },
  computed: {
     // 计算分页后的数据
     pagedData() {
      this.checklist = this.tableData.filter(data => !this.searchContent || 
        data.name.toLowerCase().includes(
        this.searchContent.toLowerCase()) ||
        data.num.includes(this.searchContent) )
      // 每页显示的第一个和最后一个条目
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;

      return this.checklist.slice(start, end);
    },
  },

  methods: {
    // 单选
    handleSelect(selection, row) {
      this.deleteTable.push(row)
      // isExited判断selected是否已经存在当前项
      let isExited = false 
      this.selected.forEach(item => {
        if(item.id === row.id) {
          isExited = true
        }
      })
      if (isExited) {
        // 若存在，代表操作是 取消选中
        this.handleDelItem(row)
      } else {
        // 反之，选中某项
        this.selected.push(row)
      }
      

    },
    // 全选或全不选
    handleSelectionAll(selection) {
      if (selection.length === 0) {
        // 若是全不选，则循环删除selected数组中存在的项
        this.pagedData.forEach(item => {
          this.handleDelItem(item)
        })
        this.deleteTable = []
      } else {
        // 全选，将selected和当前table数据合起来，注意去重！
        this.selected = this.unique(
          this.selected.concat(this.pagedData)
        )
        this.deleteTable = this.selected
      }
    },
    unique(arr) {
      return Array.from(new Set(arr))
    },
    // 删除selected数组中某项数据
    handleDelItem(row){
      let index = -1
      this.selected.forEach((item, idx) => {
        if(item.id === row.id) {
          index = idx
        }
      })
      
      if (index >= 0) {
        this.selected.splice(index, 1)
      }

    },    
    // 当前页面切换触发回显
    handleCurrentChange() {
      this.echo()
    },

    // 回显
    echo() {
      let rows = []
      this.pagedData.forEach(row => {
        this.selected.forEach(item => {
          if (row.id === item.id) {
            rows.push(row)
          }
        })
      })
      this.toggleSelection(rows)
    },

    // el-table自带方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    //删除多选学生成绩
    handleDelete() {
      let table = this.cleanDeleteTable()
      console.log(table)
      if (table.length === 0) {
        this.$message({
          type: "warning",
          message: "请至少选择一条数据",
        });
        return;
      }
      this.$confirm("此操作将打回该学生的成绩, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除学生
          summary.deleteSummary(table).then(res => {
            // 如果保存成功，则更新表格数据
            if (res.code === 200) {
              this.$message.success("删除成功");
              this.init();
            } else {
              console.log(error)
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        }).finally(() => {
          //清空删除数组
          this.deleteTable = []
          //取消选择当前的项目
          this.toggleSelection()
        });
    },
    cleanDeleteTable(){
      let countMap = {};
      // 计算每个元素出现的次数
      this.deleteTable.forEach(item => {
        let key = typeof item === 'object' ? JSON.stringify(item) : item;
        if (countMap[key]) {
          countMap[key]++;
        } else {
          countMap[key] = 1;
        }
        
      });
      // 根据元素出现的次数进行处理
      let result = this.deleteTable.filter(item => {
        let key = typeof item === 'object' ? JSON.stringify(item) : item;
        if (countMap[key] % 2 === 0) {
          // 如果元素出现偶数次，删除该元素
          return false;
        } else {
          // 如果元素出现奇数次，保留该元素
          return true;
        }
      });
      return this.unique(result)
    },
    
    init(){
      summary.getList(qs.stringify({flag:1})).then(res => {
        // 如果保存成功，则更新表格数据
        if (res.code === 200) {
          this.tableData.length = 0;
          if (res.data !== null) {
            const rawdata = res.data.summarylist;
            for (var i = 0;i < rawdata.length; i++){
              this.tableData.push({
                updateTime: parseTime.dateFormat(rawdata[i]["updateTime"]),
                num: rawdata[i]["stuNum"],
                name: rawdata[i]["stuName"],
                gpa: rawdata[i]["gpa"],
                vol: rawdata[i]["vol"],
                sci: rawdata[i]["sci"],
                pra: rawdata[i]["pra"],
                ser: rawdata[i]["ser"],
                per: rawdata[i]["per"],
                totalpoints: rawdata[i]["gpa"] + rawdata[i]["vol"] + rawdata[i]["sci"] + 
                rawdata[i]["pra"] + rawdata[i]["ser"] + rawdata[i]["per"]
              });
            }
          }
        
        } else {
          console.log(error)
          // this.$message.error("保存数据失败");
        }
      });
      
    },

    //导出
    exportClick() {
      //第一个参数是到处后文件名，第二个是id绑定表格dom
      this.exportExcel("学生评分汇总_已测评", "mainTable");
    },
    //转换数据
    exportExcel(filename, tableId) {
      var xlsxParam = { raw: true };
      var table = document.createElement('table');
      var thead = document.createElement('thead');
      var tbody = document.createElement('tbody');

      // 创建表头
      var header = this.tableData[0];
      var tr = document.createElement('tr');
      for (var key in header) {
        var th = document.createElement('th');
        th.innerText = key;
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      // 创建表格内容
      for (var i = 0; i < this.tableData.length; i++) {
        var item = this.tableData[i];
        var tr = document.createElement('tr');
        for (var key in item) {
          var td = document.createElement('td');
          td.innerText = item[key];
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }

      table.appendChild(thead);
      table.appendChild(tbody);

      var wb = XLSX.utils.table_to_book(table, xlsxParam);
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                filename + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") {
          console.log(e, wbout);
        }
      }
      return wbout;
    },
  },
};
</script>

<style scoped>
  html, body {
   height: 100%;
   width: 100%;
 }
 .container {
  margin: 10px auto;
    max-width: 900px;
   display: flex;
   flex-direction: column;
   height: 100vh;
 }
 .title {
   font-size: 28px;
   text-align: center;
 }
 .titleBtn {
   margin: 20px 0;
   margin-bottom: 50px;
 }
 .main {
   flex: 1;
   width: 100%;
   overflow-y: auto;
 }

 .red-button {
  background-color: rgb(245, 108, 108);
  color: white;
}

.blue-button {
  background-color: rgb(64, 158, 255);
  color: white;
}

</style>
  
