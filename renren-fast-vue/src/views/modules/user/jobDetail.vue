<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-10-26 22:34:44
 * @LastEditTime: 2020-11-24 23:04:39
 * @LastEditors: yfye
-->
<template>
  <el-dialog title="职位详情" @close="cancel" :visible.sync="visible">
    <div class="userDetail">
    <p>职位标题:{{ params.jobTitle }}</p>
    <p>
      薪资:{{ params.jobPrice }}元/{{
        params.jobPaytype === 1 ? "时" : params.jobPaytype === 2 ? "天" : "月"
      }}
    </p>
    <p>工作区域:{{ params.jobQycode }}</p>
    <p>所招人数:{{ params.jobPrezpNum }}</p>
    <p>
      招人限制:{{
        params.jobSex === 1
          ? "只招男生"
          : params.jobSex === 2
          ? "只招女生"
          : "男女不限"
      }}
    </p>
    <div>
      工作内容:
      <p v-html="params.jobIntroduce"></p>
    </div>
    <p>必备技能:{{ params.jobRequireSkill }}</p>
    <p>备注:{{ params.jobBz }}</p>
    <p>工作时间:{{ params.jobStartTimeStr }}</p>
    <p>工作地点:{{ params.jobAddress }}</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      params: {}
    };
  },
  created() {},
  methods: {
    init(params) {
    
      this.$http({
        url: this.$http.adornUrl(`/job/sysjob/info/${params.jobId}`),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.params = data.sysJob;
          this.visible = true;
        }
      });
    },
    cancel() {
      this.visible = false;
      this.$emit("refreshDataList");
    },
    dataFormSubmit() {
      this.visible = false;
      this.$emit("refreshDataList");
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.userDetail{
 /*  font-weight: bold; */
  font-size: 18px;
}
.userDetail p{
 margin-bottom: 8px;
}
</style>
