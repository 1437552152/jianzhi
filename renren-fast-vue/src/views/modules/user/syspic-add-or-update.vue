<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-10-26 22:34:44
 * @LastEditTime: 2020-10-26 22:57:23
 * @LastEditors: yfye
-->
<template>
  <el-dialog
    title="用户详情"
    @close="cancel"
    :visible.sync="visible"
  >
  {{params.nickName}}
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
       params:{}
      }
    },
  created() {},
  methods: {
    init(params) { 
      this.visible = true;
      this.params=params;
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
</style>
