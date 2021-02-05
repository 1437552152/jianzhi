<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.picTitle" placeholder="请输入标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:syspic:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
         <el-button type="primary" @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
        <el-table-column
        prop="jobTitle"
        header-align="center"
        align="center"
        label="职位标题">
      </el-table-column>

       <el-table-column
        prop="jobBmbackprice"
        header-align="center"
        align="center"
        label="报名佣金(元)">
      </el-table-column>

 <el-table-column
        prop="jobFxbackprice"
        header-align="center"
        align="center"
        label="一级分享佣金(元)">
      </el-table-column>
    <el-table-column
        prop="jobFxejbackprice"
        header-align="center"
        align="center"
        label="二级分享佣金(元)">
      </el-table-column>

     <el-table-column
        prop="payForTime"
        header-align="center"
        align="center"
        label="工作时间结算">
      </el-table-column>

     <el-table-column
        prop="monthPay"
        header-align="center"
        align="center"
        label="当月工资(元)">
      </el-table-column>

       <el-table-column
        prop="payTime"
        header-align="center"
        align="center"
        label="结算时间">
      </el-table-column>

       <el-table-column
        prop="payStubsBz"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
  
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
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
    <JiesuanAdd v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></JiesuanAdd>
  </div>
</template>

<script>
  import JiesuanAdd from './JiesuanAdd';
  import moment from 'moment';
  export default {
    data () {
      return {
        dataForm: {
          key: ''
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
      JiesuanAdd
    },
    activated () {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList () {    
        this.dataListLoading = true;
         this.addOrUpdateVisible=false;
        this.$http({
          url: this.$http.adornUrl('/my/mypaystubs/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'picTitle': this.dataForm.picTitle,
            'jobId':this.$route.query.jobId,
            'userId':this.$route.query.userId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
           /*  data.page.list.lenth&&data.page.list.map((item)=>{
              item.payForTime=moment(item.payForTime).format("MM")
            }) */
            this.dataList = data.page.list;
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
      addOrUpdateHandle (params) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(params);
        })
      },
      // 删除
      deleteHandle (id) {
          return;
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.picId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/syspic/delete'),
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
      goBack(){
          this.$router.go(-1);
      }
    }
  }
</script>
