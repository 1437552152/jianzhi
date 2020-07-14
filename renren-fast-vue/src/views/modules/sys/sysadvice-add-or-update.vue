<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="意见标题" prop="adviceTitle">
      <el-input v-model="dataForm.adviceTitle" placeholder="意见标题"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="contactEmail">
      <el-input v-model="dataForm.contactEmail" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item label="反馈意见类型：1.反馈问题，2、合作申请、3、功能建议  4、其他" prop="adviceType">
      <el-input v-model="dataForm.adviceType" placeholder="反馈意见类型：1.反馈问题，2、合作申请、3、功能建议  4、其他"></el-input>
    </el-form-item>
    <el-form-item label="反馈内容" prop="adviceContent">
      <el-input v-model="dataForm.adviceContent" placeholder="反馈内容"></el-input>
    </el-form-item>
    <el-form-item label="0、未读，1、已读" prop="adviceRead">
      <el-input v-model="dataForm.adviceRead" placeholder="0、未读，1、已读"></el-input>
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
    data () {
      return {
        visible: false,
        dataForm: {
          adviceId: 0,
          adviceTitle: '',
          contactEmail: '',
          adviceType: '',
          adviceContent: '',
          adviceRead: ''
        },
        dataRule: {
          adviceTitle: [
            { required: true, message: '意见标题不能为空', trigger: 'blur' }
          ],
          contactEmail: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' }
          ],
          adviceType: [
            { required: true, message: '反馈意见类型：1.反馈问题，2、合作申请、3、功能建议  4、其他不能为空', trigger: 'blur' }
          ],
          adviceContent: [
            { required: true, message: '反馈内容不能为空', trigger: 'blur' }
          ],
          adviceRead: [
            { required: true, message: '0、未读，1、已读不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.adviceId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.adviceId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/sysadvice/info/${this.dataForm.adviceId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.adviceTitle = data.sysAdvice.adviceTitle
                this.dataForm.contactEmail = data.sysAdvice.contactEmail
                this.dataForm.adviceType = data.sysAdvice.adviceType
                this.dataForm.adviceContent = data.sysAdvice.adviceContent
                this.dataForm.adviceRead = data.sysAdvice.adviceRead
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
              url: this.$http.adornUrl(`/sys/sysadvice/${!this.dataForm.adviceId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'adviceId': this.dataForm.adviceId || undefined,
                'adviceTitle': this.dataForm.adviceTitle,
                'contactEmail': this.dataForm.contactEmail,
                'adviceType': this.dataForm.adviceType,
                'adviceContent': this.dataForm.adviceContent,
                'adviceRead': this.dataForm.adviceRead
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
