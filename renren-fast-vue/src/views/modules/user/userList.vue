<template>
  <div class="mod-config">
   <!--  <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.compName" placeholder="公司名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('comp:syscomp:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('comp:syscomp:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form> -->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
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
        prop="mobile"
        header-align="center"
        align="center"
        label="电话">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="账号状态">
       <template slot-scope="scope">
          <el-tag type="text" size="small">{{scope.row.status==0?'禁用':'正常'}}</el-tag>
        </template>
      </el-table-column>
     

      <el-table-column
        prop="nativeplace"
        header-align="center"
        align="center"
        label="籍贯">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        label="性别">
      </el-table-column>
       <el-table-column
        prop="birthday"
        header-align="center"
        align="center"
        label="出生日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="350"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.openid)">我的团队</el-button>
          <el-button type="text" size="small" @click="BaomingListHandle(scope.row.openid)">报名记录</el-button>
          <el-button type="text" size="small" @click="TixianListHandle(scope.row.openid)">提现记录</el-button>
          <el-button type="text" size="small" @click="LJSYHandle(scope.row.openid)">累计收益</el-button>
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
    <BaomingList v-if="BaomingList" ref="BaomingList"></BaomingList>
    <TixianList v-if="TixianList" ref="TixianList"></TixianList>
 <LJSYList v-if="LJSYList" ref="LJSYList"></LJSYList>

  </div>
</template>

<script>
  import AddOrUpdate from './syscomp-add-or-update';
  import BaomingList from './baomingList';
  import TixianList from './tixianList';
  import LJSYList from './ljsyList';
  export default {
    data () {
      return {
        dataForm: {
          compName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        BaomingList:false,
        TixianList:false,
        LJSYList:false
      }
    },
    components: {
      AddOrUpdate,
      BaomingList,
      TixianList,
      LJSYList
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
          url: this.$http.adornUrl('/sys/user/list2'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'compName': this.dataForm.compName
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
          this.$refs.addOrUpdate.init(id)
        })
      },
BaomingListHandle(id){
  this.BaomingList=true;
      this.$nextTick(() => {
          this.$refs.BaomingList.init(id)
        })

},
TixianListHandle(id){
  this.TixianList=true;
      this.$nextTick(() => {
          this.$refs.TixianList.init(id)
        })

},
LJSYHandle(id){
  this.LJSYList=true;
      this.$nextTick(() => {
          this.$refs.LJSYList.init(id)
        })

}

    }
  }
</script>
