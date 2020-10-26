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
      dataForm: {
        id: 0,
        beanName: "",
        params: "",
        cronExpression: "",
        remark: "",
        status: 0
      },
      dataRule: {
        beanName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        cronExpression: [
          { required: true, message: "cron表达式不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
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
