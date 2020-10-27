<template>
  <el-dialog title="结算" :close-on-click-modal="false" :visible.sync="visible">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="所结工资时间" prop="beanName">
        <el-date-picker v-model="dataForm.time" type="month" placeholder="时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="当月工资" prop="beanName">
        <el-input v-model="dataForm.beanName" placeholder="请输入当月工资">
          <template slot="append">应发:1120元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="一级分享佣金" prop="params">
        <el-input v-model="dataForm.params" placeholder="请输入一级分享佣金">
          <template slot="append">应发:23元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="二级分享佣金" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" placeholder="请输入二级分享佣金">
          <template slot="append">应发:45元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="报名佣金" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" placeholder="请输入报名佣金">
          <template slot="append">应发:675元</template>
        </el-input>
      </el-form-item>

        <el-form-item label="是否上传工资条"  prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="工资条上传" prop="picSaveUrl" v-if="dataForm.type==1">
        <el-upload
          class="avatar-uploader"
          :action="PicUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-if="dataForm.picSaveUrl"
            :src="dataForm.picSaveUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
       PicUrl: `${window.SITE_CONFIG.baseUrl}/sys/syspic/fileUpload`,
      dataForm: {
        id: 0,
        beanName: "",
        params: "",
        cronExpression: "",
        remark: "",
        status: 0,
          picSaveUrl: "",
            type:"1"
      },
      dataRule: {
        beanName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        cronExpression: [
          { required: true, message: "cron表达式不能为空", trigger: "blur" }
        ],
         type: [
          { required: true, message: "请选择是否上传工资条", trigger: "change" }
        ],
        picSaveUrl: [
          {
            required: true,
            message: "工资条不能为空",
            trigger: "blur"
          }
        ],
      }
    };
  },
  methods: {
     handleAvatarSuccess(res, file) {
      if (!res.code) {
        this.dataForm.picSaveUrl = `${window.SITE_CONFIG.upLoadUrl}${res.url}`;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/schedule/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.beanName = data.schedule.beanName;
              this.dataForm.params = data.schedule.params;
              this.dataForm.cronExpression = data.schedule.cronExpression;
              this.dataForm.remark = data.schedule.remark;
              this.dataForm.status = data.schedule.status;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$confirm(`一旦结算将不可更改，确定结算该月的工资吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        debugger;
      });

      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/schedule/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              jobId: this.dataForm.id || undefined,
              beanName: this.dataForm.beanName,
              params: this.dataForm.params,
              cronExpression: this.dataForm.cronExpression,
              remark: this.dataForm.remark,
              status: !this.dataForm.id ? undefined : this.dataForm.status
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
