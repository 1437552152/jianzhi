<template>
  <div class="mod-schedule">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.jobTitle" placeholder="请输入职位标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.nickName" placeholder="请输入用户昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>

      <el-table-column prop="jobTitle" header-align="center" align="center" label="职位标题"></el-table-column>
      <el-table-column prop="nickName" header-align="center" align="center" label="昵称"></el-table-column>

      <el-table-column prop="status" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.luyongType == 1" size="small">报名待审核</el-tag>
          <el-tag v-if="scope.row.luyongType == 2" size="small">已录用,到岗待审核</el-tag>
          <el-tag v-if="scope.row.luyongType == 3" size="small">已到岗</el-tag>
          <el-tag v-if="scope.row.luyongType == 5" size="small">报名审核不通过</el-tag>
          <el-tag v-if="scope.row.luyongType == 6" size="small">未到岗</el-tag>
        </template>
      </el-table-column>
       <el-table-column prop="cancelResion" header-align="center" align="center" label="备注" v-if="luyongType==5||luyongType==6">
        <template slot-scope="scope">
           {{scope.row.cancelResion}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row)">用户详情</el-button>
          <el-button type="text" size="small" @click="resumeHandle(scope.row)">职位详情</el-button>
          <el-button type="text" @click="pauseHandle(scope.row)" v-if="luyongType==1||luyongType==2">审核</el-button>
          <el-button type="text" @click="goJiesuan(scope.row)" v-if="luyongType==3">去结算</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <el-dialog title="是否审核通过" @close="cancel" :visible.sync="visible">
      <el-form
      :model="checkForm"
      :label-width="150"
      ref="checkForm"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item label="是否通过" prop="luyongType">
        <el-radio-group v-model="checkForm.luyongType">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
      </el-form-item>
       <el-form-item label="原因" prop="cancelResion" v-if="checkForm.luyongType==2">
          <el-input type="textarea" v-model="checkForm.cancelResion"></el-input>
      </el-form-item>   
    </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗, 新增 / 修改 -->
    <jobDetail v-if="jobDetailVisible" ref="jobDetail" @refreshDataList="getDataList"></jobDetail>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./syspic-add-or-update";
import jobDetail from "./jobDetail";
export default {
  data() {
    return {
      dataForm: {
        jobTitle: "",
         nickName:''       
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      jobDetailVisible: false,
      visible: false,
      params:{},
      checkForm:{
        cancelResion:"",
        luyongType:'1'
      }
    };
  },
  components: {
    AddOrUpdate,
    jobDetail
  },
  props: ["luyongType"],
  methods: {
    // 获取数据列表
    getDataList() {
      const that = this;
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/my/mysh/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          jobTitle: this.dataForm.jobTitle,
          nickName: this.dataForm.nickName, 
          luyongType: this.luyongType
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          that.dataList = data.page.list;
          that.totalPage = data.page.totalCount;
        } else {
          that.dataList = [];
          that.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(params) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(params);
      });
    },
    cancel() {
      this.visible = false;
      this.checkForm.cancelResion ="";
      this.checkForm.luyongType = "1";
      this.getDataList();
    },
    dataFormSubmit() {
      this.visible = false;
      this.$refs["checkForm"].validate(valid => {
        if (valid) {
             let type=1;
             if(this.luyongType==1){
               type=this.checkForm.luyongType==1?2:5;
             }else if(this.luyongType==2){
                type=this.checkForm.luyongType==1?3:6;
             }
              this.$http({
            url: this.$http.adornUrl(
              `/my/mysh/update`
            ),
            method: "post",
            data: this.$http.adornData({
              luyongType:type,
              myJobId:this.params.myJobId,
              cancelResion:this.checkForm.cancelResion
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;  
                  this.checkForm.respon ="";
                  this.checkForm.luyongType = "1";            
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }})
    },
    // 暂停
    pauseHandle(params) {
      this.visible = true;
      this.params=params;
    },
    // 恢复
    resumeHandle(params) {
      this.jobDetailVisible = true;
      this.$nextTick(() => {
        this.$refs.jobDetail.init(params);
      });
    },
    goJiesuan(params){
       this.$router.push({ path: `/user/jiesuan?jobId=${params.jobId}&openid=${params.openid}` })
    }
  },
  created() {
    this.getDataList();
  }
};
</script>
