<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="职位种类名称" prop="typeName">
      <el-input v-model="dataForm.typeName" placeholder="职位种类名称"></el-input>
    </el-form-item>


  <el-form-item label="首页上传" prop="picSaveUrl">
      <el-upload
        class="avatar-uploader"
        :action="PicUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        >
        <img v-if="dataForm.picSaveUrl" :src="dataForm.picSaveUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="占位图上传" prop="zhanSaveUrl">
      <el-upload
        class="avatar-uploader"
        :action="PicUrl"
        :show-file-list="false"
        :on-success="zhanSaveUrlhandleAvatarSuccess"
        >
        <img v-if="dataForm.zhanSaveUrl" :src="dataForm.zhanSaveUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>



    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Moment from 'moment'
  export default {
    data () {
      return {
        visible: false,
        PicUrl:`${window.SITE_CONFIG.baseUrl}/sys/syspic/fileUpload`,
        dataForm: {
          jobtypeId: 0,
          typeName: '',
          picSaveUrl: '',
          zhanSaveUrl:''
        },
        dataRule: {
          typeName: [
            { required: true, message: '职位种类名称不能为空', trigger: 'blur' }
          ],
          picSaveUrl: [
            { required: true, message: '首页图片地址不能为空', trigger: 'blur' }
          ],
            zhanSaveUrl: [
            { required: true, message: '占位图片地址不能为空', trigger: 'blur' }
          ],
        },
       
      }
    }, 
   
    
    methods: {
// 图片上传
      handleAvatarSuccess(res, file) {
        if(!res.code){
          this.dataForm.picSaveUrl =`${window.SITE_CONFIG.upLoadUrl}${res.url}` ;
        }   
      },
     zhanSaveUrlhandleAvatarSuccess(res, file) {
        if(!res.code){
          this.dataForm.zhanSaveUrl =`${window.SITE_CONFIG.upLoadUrl}${res.url}` ;
        }   
      },

      beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;     
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },

      init (id) {
        this.dataForm.jobtypeId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.jobtypeId) {
            this.$http({
              url: this.$http.adornUrl(`/job/sysjobtype/info/${this.dataForm.jobtypeId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.typeName = data.sysJobtype.typeName;
                this.dataForm.picSaveUrl = data.sysJobtype.picSaveUrl;
                 this.dataForm.zhanSaveUrl = data.sysJobtype.zhanSaveUrl;

                
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/job/sysjobtype/${!this.dataForm.jobtypeId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'jobtypeId': this.dataForm.jobtypeId || undefined,
                'typeName': this.dataForm.typeName,
                'picSaveUrl': this.dataForm.picSaveUrl,
                'zhanSaveUrl':this.dataForm.zhanSaveUrl
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
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
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width:100px;
    height:100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height:100px;
    display: block;
  }
</style>