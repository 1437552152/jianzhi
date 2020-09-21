<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    @close="cancel"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      :label-width="150"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="配置名称" prop="pzType">
        <el-input v-model="dataForm.pzType" placeholder="配置名称"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="picTitle">
        <el-input v-model="dataForm.picTitle" placeholder="标题"></el-input>
      </el-form-item>

      <el-form-item label="图片上传" prop="picSaveUrl">
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
      <!--  <el-form-item label="图片跳转地址" prop="picLinkUrl">
      <el-input v-model="dataForm.picLinkUrl" placeholder="点击图片跳转地址"></el-input>
    </el-form-item> -->
      <el-form-item label="序号" prop="orderid">
        <el-input v-model="dataForm.orderid" placeholder="排序序号"></el-input>
      </el-form-item>
      <!-- <el-form-item label="图片创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="图片创建时间"></el-input>
    </el-form-item> -->
      <div class="mod-demo-ueditor" v-if="flag">
        <el-form-item label="描述" prop="descript">
          <script
            :id="ueId"
            class="ueditor-box"
            type="text/plain"
            style="width: 100%; height: 260px;"
          >
            {{dataForm.descript}}
          </script>
        </el-form-item>
      </div>
      <!--  <el-form-item label="描述" prop="descript">
      <el-input v-model="dataForm.descript" placeholder="描述"></el-input>
    </el-form-item> -->
      <!-- <el-form-item label="备用字段" prop="byzd">
      <el-input v-model="dataForm.byzd" placeholder="备用字段"></el-input>
    </el-form-item> -->
    </el-form>
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
      flag: false,
      PicUrl: `${window.SITE_CONFIG.baseUrl}/sys/syspic/fileUpload`,
      dataForm: {
        picId: 0,
        picTitle: "",
        picSaveUrl: "",
        picLinkUrl: "",
        orderid: "",
        descript: "",
        pzType: ""
      },
      ue: null,
      ueId: `J_ueditorBox_${new Date().getTime()}`,
      ueContent: "",
      dataRule: {
        pzType: [
          { required: true, message: "配置名称不能为空", trigger: "blur" }
        ],
        picTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        picSaveUrl: [
          {
            required: false,
            message: "图片保存的服务器地址不能为空",
            trigger: "blur"
          }
        ],
        /*    picLinkUrl: [
            { required: true, message: '点击图片跳转地址不能为空', trigger: 'blur' }
          ], */
        orderid: [
          { required: true, message: "排序序号不能为空", trigger: "blur" }
        ],
        // createTime: [
        //   { required: true, message: '图片创建时间不能为空', trigger: 'blur' }
        // ],
        descript: [{ required: true, message: "描述不能为空", trigger: "blur" }]
        // byzd: [
        //   { required: true, message: '备用字段不能为空', trigger: 'blur' }
        // ]
      }
    };
  },
  created() {},
  methods: {
    // 图片上传
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
      this.dataForm.picId = id || 0;
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.picId) {
          this.$http({
            url: this.$http.adornUrl(`/sys/syspic/info/${this.dataForm.picId}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.picTitle = data.sysPic.picTitle;
              this.dataForm.picSaveUrl = data.sysPic.picSaveUrl;
              this.dataForm.picLinkUrl = data.sysPic.picLinkUrl;
              this.dataForm.orderid = data.sysPic.orderid;
              this.dataForm.descript = data.sysPic.descript;
              this.dataForm.pzType = data.sysPic.pzType;

              this.flag = true;
              this.visabled();
            } else {
              this.flag = true;
              this.visabled();
            }
          });
        } else {
          this.flag = true;
          this.visabled();
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.getContent();
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/syspic/${!this.dataForm.picId ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              picId: this.dataForm.picId || undefined,
              picTitle: this.dataForm.picTitle,
              picSaveUrl: this.dataForm.picSaveUrl,
              picLinkUrl: this.dataForm.picLinkUrl,
              orderid: this.dataForm.orderid,
              descript: this.dataForm.descript,
              pzType: this.dataForm.pzType
              // 'byzd': this.dataForm.byzd
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.ueContent = "";
                  this.dataForm.descript = "";
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    cancel() {
      this.visible = false;
      this.ueContent = "";
      this.dataForm.descript = "";
      this.$emit("refreshDataList");
    },
    visabled() {
      this.$nextTick(() => {
        this.ue = ueditor.getEditor(this.ueId, {
          zIndex: 3000
        });
      });
    },
    getContent() {
      this.ue.ready(() => {
        this.ueContent = this.ue.getContent();
        this.dataForm.descript = this.ue.getContent();
      });
    },
    destroyed() {
      this.flag = false;
      this.ueContent = "";
      this.dataForm.descript = "";
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
