<template>
  <div class="mod-config">
<!--     <el-form :inline="true" :model="dataForm" ref="dataForm"  @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.nickName" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item label="审核状态">
    <el-select v-model="dataForm.txShStatue" placeholder="请选择审核状态" clearable>
      <el-option label="全部" value=""></el-option>
      <el-option label="待审核" value="0"></el-option>
      <el-option label="已审核" value="1"></el-option>
    </el-select>
  </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
         </el-form-item>
    </el-form> -->
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
        width="50">
      </el-table-column>
       <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
       <el-table-column
        prop="nickName"
        header-align="center"
        align="center"
        label="昵称">
      </el-table-column>

 <el-table-column
        prop="jobTitle"
        header-align="center"
        align="center"
        label="职位标题">
      </el-table-column>

      <el-table-column
        prop="oderCode"
        header-align="center"
        align="center"
        label="订单号">
      </el-table-column>

      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="支付时间">
      </el-table-column>

       <el-table-column
        prop="depositNum"
        header-align="center"
        align="center"
        label="押金数目">
      </el-table-column>

     <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="退款时间">
      </el-table-column>



      <el-table-column
        prop="depositStatue"
        header-align="center"
        align="center"
        label="押金状态">
        <template slot-scope="scope">
          <el-tag type="text" size="small">{{scope.row.depositStatue==0?"处于押金状态":'已退款'}}</el-tag>
        </template>
      </el-table-column>
     
    
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-if="scope.row.depositStatue==0" @click="UpdateHandle(scope.row.depositStatue,scope.row.depositId)">退款</el-button>
           <a style="color:#ddd" v-if="scope.row.depositStatue==1" >已退款</a>
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          nickName: '',
          txShStatue:''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
         let params={};
         params.page=this.pageIndex;
          params.limit= this.pageSize;
           params.nickName=this.dataForm.nickName;
           if(this.dataForm.txShStatue){
             params.txShStatue=Number(this.dataForm.txShStatue)
           }
        this.$http({
          url: this.$http.adornUrl('/sys/sysdeposit/list'),
          method: 'get',
          params: this.$http.adornParams(params)
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
      UpdateHandle(value,id){
     this.$http({
          url: this.$http.adornUrl(`/my/mytx/confirm/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
 this.getDataList()
          } else {
          
          }
        })
      }
    }
  }
</script>
