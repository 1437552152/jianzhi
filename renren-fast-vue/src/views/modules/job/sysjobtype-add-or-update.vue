<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="职位种类民称" prop="typeName">
      <el-input v-model="dataForm.typeName" placeholder="职位种类民称"></el-input>
    </el-form-item>
        <el-form-item label="图片上传" prop="picSaveUrl">
      <el-upload
        class="avatar-uploader"
        :action="PicUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="dataForm.picSaveUrl" :src="dataForm.picSaveUrl" class="avatar">
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
          picSaveUrl: ''
        },
        dataRule: {
          typeName: [
            { required: true, message: '职位种类民称不能为空', trigger: 'blur' }
          ],
          picSaveUrl: [
            { required: true, message: '图片保存的服务器地址不能为空', trigger: 'blur' }
          ],
        },
       
      }
    }, 
   
    
    methods: {
// 图片上传
      handleAvatarSuccess(res, file) {
        if(!res.code){
           this.dataForm.picSaveUrl = res.url;
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
                this.dataForm.picSaveUrl = data.sysPic.picSaveUrl
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
                   'picSaveUrl': this.dataForm.picSaveUrl
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
