<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" :label-width="150" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="标题" prop="picTitle">
      <el-input v-model="dataForm.picTitle" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="图片上传" prop="picSaveUrl">
      <el-upload
        class="avatar-uploader"
        action="http://r182s02546.51mypc.cn/renren-fast/sys/syspic/fileUpload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="dataForm.picSaveUrl" :src="dataForm.picSaveUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <!-- <el-input v-model="dataForm.picSaveUrl" placeholder="图片保存的服务器地址"></el-input> -->
    </el-form-item>
    <el-form-item label="图片跳转地址" prop="picLinkUrl">
      <el-input v-model="dataForm.picLinkUrl" placeholder="点击图片跳转地址"></el-input>
    </el-form-item>
    <el-form-item label="序号" prop="orderid">
      <el-input v-model="dataForm.orderid" placeholder="排序序号"></el-input>
    </el-form-item>
    <!-- <el-form-item label="图片创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="图片创建时间"></el-input>
    </el-form-item> -->
    <el-form-item label="描述" prop="descript">
      <el-input v-model="dataForm.descript" placeholder="描述"></el-input>
    </el-form-item>
    <!-- <el-form-item label="备用字段" prop="byzd">
      <el-input v-model="dataForm.byzd" placeholder="备用字段"></el-input>
    </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          picId: 0,
          picTitle: '',
          picSaveUrl: '',
          picLinkUrl: '',
          orderid: '',
          // createTime: '',
          descript: ''
          // byzd: ''
        },
        dataRule: {
          picTitle: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          picSaveUrl: [
            { required: true, message: '图片保存的服务器地址不能为空', trigger: 'blur' }
          ],
          picLinkUrl: [
            { required: true, message: '点击图片跳转地址不能为空', trigger: 'blur' }
          ],
          orderid: [
            { required: true, message: '排序序号不能为空', trigger: 'blur' }
          ],
          // createTime: [
          //   { required: true, message: '图片创建时间不能为空', trigger: 'blur' }
          // ],
          descript: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          // byzd: [
          //   { required: true, message: '备用字段不能为空', trigger: 'blur' }
          // ]
        }
      }
    },
    methods: {
// 图片上传
      handleAvatarSuccess(res, file) {
        debugger;
        if(!res.code){
           this.dataForm.picSaveUrl = res.url;
        }
        
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      init (id) {
        this.dataForm.picId = id || 0;
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.picId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/syspic/info/${this.dataForm.picId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.picTitle = data.sysPic.picTitle
                this.dataForm.picSaveUrl = data.sysPic.picSaveUrl
                this.dataForm.picLinkUrl = data.sysPic.picLinkUrl
                this.dataForm.orderid = data.sysPic.orderid
                // this.dataForm.createTime = data.sysPic.createTime
                this.dataForm.descript = data.sysPic.descript
                // this.dataForm.byzd = data.sysPic.byzd
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
              url: this.$http.adornUrl(`/sys/syspic/${!this.dataForm.picId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'picId': this.dataForm.picId || undefined,
                'picTitle': this.dataForm.picTitle,
                'picSaveUrl': this.dataForm.picSaveUrl,
                'picLinkUrl': this.dataForm.picLinkUrl,
                'orderid': this.dataForm.orderid,
                // 'createTime': this.dataForm.createTime,
                'descript': this.dataForm.descript
                // 'byzd': this.dataForm.byzd
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