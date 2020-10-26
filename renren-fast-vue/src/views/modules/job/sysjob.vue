<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.jobTitle" placeholder="请输入职位标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('job:sysjob:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('job:sysjob:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        fixed
        width="50">
      </el-table-column>
        <el-table-column
        prop="jobTitle"
        header-align="center"
         width="200"
        align="center"
        label="职位标题">
      </el-table-column>
      <el-table-column
        prop="compName"
        header-align="center"
        align="center"
        width="200"
         fixed
        label="公司名称">
      </el-table-column>
      <el-table-column
        prop="jobAddress"
        header-align="center"
        align="center"
         width="200"
        label="工作地点">
      </el-table-column>
    <!--   <el-table-column
        prop="jobIntroduce"
        header-align="center"
        align="center"
         width="200"
        label="工作介绍">
      </el-table-column> -->
    <!--   <el-table-column
        prop="jobDesc"
         width="200"
        header-align="center"
        align="center"
        label="职位描述">
      </el-table-column> -->
      <el-table-column
        prop="jobRequireSkill"
        header-align="center"
         width="200"
        align="center"
        label="职位必备技能">
      </el-table-column>
      <el-table-column
        prop="jobPrice"
        header-align="center"
         width="200"
        align="center"
        label="工作薪资/元">
      </el-table-column>
      <el-table-column
        prop="jobStartTime"
        header-align="center"
        align="center"
         width="200"
        label="工作开始时间">
      </el-table-column>
      <el-table-column
        prop="jobEndTime"
         width="200"
        header-align="center"
        align="center"
        label="工作结束时间">
      </el-table-column>
      <el-table-column
        prop="jobBmfs"
        header-align="center"
         width="200"
        align="center"
        label="工作报名方式">
      </el-table-column>

      <el-table-column
        prop="jobPrezpNum"
        header-align="center"
         width="200"
        align="center"
        label="预招聘的人数">
      </el-table-column>

     <el-table-column
        prop="jobAlreadbmNum"
        header-align="center"
         width="200"
        align="center"
        label="已报名人数">
      </el-table-column>

      <el-table-column
        prop="jobBz"
        header-align="center"
         width="200"
        align="center"
        label="工作备注">
      </el-table-column>

 <el-table-column
        prop="jobPaytype"
        header-align="center"
         width="200"
        align="center"
        label="工资结算方式">
         <template slot-scope="scope">
         <p>{{ scope.row.jobPaytype===1?'小时':scope.row.jobPaytype===2?'天':'月'}}</p>
      </template>
      </el-table-column>

 <el-table-column
        prop="jobSex"
        header-align="center"
         width="200"
        align="center"
        label="性别限制">
         <template slot-scope="scope">
         <p>{{ scope.row.jobSex===1?'只招男生':scope.row.jobPaytype===2?'只招女生':'男女不限'}}</p>
      </template>
      </el-table-column>

   <!--   <el-table-column
        prop="jobFxbackprice"
        header-align="center"
         width="200"
        align="center"
        label="分享佣金/元">
      </el-table-column> -->

       <el-table-column
        prop="jobBmbackprice"
        header-align="center"
         width="200"
        align="center"
        label="报名佣金/元">
      </el-table-column>

     <el-table-column
        prop="jobStatue"
        header-align="center"
         width="200"
        align="center"
        label="职位状态">
        <template slot-scope="scope">
         <p>{{ scope.row.jobStatue?'热招中':'已停招'}}</p>
      </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.jobId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.jobId)">删除</el-button>
          <el-button type="text" size="small"  v-if="scope.row.jobStatue" @click="updateHandle(scope.row.jobId,!scope.row.jobStatue)">停招</el-button>
          <el-button type="text" size="small"  v-if="!scope.row.jobStatue" @click="updateHandle(scope.row.jobId,!scope.row.jobStatue)">发布</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './sysjob-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          jobTitle: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
        this.addOrUpdateVisible=false;
        this.$http({
          url: this.$http.adornUrl('/job/sysjob/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'jobTitle': this.dataForm.jobTitle
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id);
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.jobId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/job/sysjob/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      updateHandle(id,status){
         this.$http({
            url: this.$http.adornUrl('/job/sysjob/changejobstatue'),
            method: 'get',
            params:this.$http.adornParams({
                'jobId': id,
                'jobStatue':status===false?0:1         
              })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
      }
    }
  }
</script>
