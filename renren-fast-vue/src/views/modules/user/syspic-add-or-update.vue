<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-10-26 22:34:44
 * @LastEditTime: 2020-10-28 23:11:26
 * @LastEditors: yfye
-->
<template>
  <el-dialog title="用户详情" @close="cancel" :visible.sync="visible">
     <div class="userDetail">
    <p>昵称:{{params.nickName}}</p>
    <p>头像:<img :src="params.avatarUrl" class="avatar"></p>
    <p v-if="params.username">真实姓名:{{params.username}}</p>
    <p v-if="params.sex">性别:{{params.sex}}</p>
    <p v-if="params.mobile">手机号:{{params.mobile}}</p>
    <p v-if="params.birthday">出生年月:{{params.birthday}}</p>
    <p v-if="params.nativeplace">籍贯:{{params.nativeplace}}</p>
    <p v-if="params.wxNum">微信:{{params.wxNum}}</p>
    <p v-if="params.qqNum">QQ:{{params.qqNum}}</p>
    <p v-if="params.finishSchool">毕业学校:{{params.finishSchool}}</p>
    <p v-if="params.myDiploma">学历:{{params.myDiploma}}</p>
    <p v-if="params.myMajor">专业:{{params.myMajor}}</p>
    <p v-if="params.stadyTime">入学年份:{{params.stadyTime}}</p>
    <p v-if="params.myAbout">自我描述:{{params.myAbout}}</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ueditor from "ueditor";
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
      this.visible = true;
      this.params = params;
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
 width: 60px;
    border-radius: 50%;
    margin-left: 20px;
}
.userDetail{
 /*  font-weight: bold; */
  font-size: 18px;
}
.userDetail p{
 margin-bottom: 8px;
}
</style>
