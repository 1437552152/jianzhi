<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <!-- <el-form-item label="联系电话" prop="telephone">
      <el-input v-model="dataForm.telephone" placeholder="联系电话"></el-input>
    </el-form-item>
    <el-form-item label="公司邮箱" prop="companyEmail">
      <el-input v-model="dataForm.companyEmail" placeholder="公司邮箱"></el-input>
    </el-form-item>
    <el-form-item label="公司地址" prop="companyAddr">
      <el-input v-model="dataForm.companyAddr" placeholder="公司地址"></el-input>
    </el-form-item> -->
    <el-form-item label="手机号码" prop="phoneNum">
      <el-input v-model="dataForm.phoneNum" placeholder="手机号码"></el-input>
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
          configId: 0,
          telephone: '',
          companyEmail: '',
          companyAddr: '',
          phoneNum: ''
        },
        dataRule: {
          telephone: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' }
          ],
          companyEmail: [
            { required: true, message: '公司邮箱不能为空', trigger: 'blur' }
          ],
          companyAddr: [
            { required: true, message: '公司地址不能为空', trigger: 'blur' }
          ],
          phoneNum: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.configId = id || 0;
         this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.configId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/baseconfig/info/${this.dataForm.configId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.telephone = data.baseConfig.telephone
                this.dataForm.companyEmail = data.baseConfig.companyEmail
                this.dataForm.companyAddr = data.baseConfig.companyAddr
                this.dataForm.phoneNum = data.baseConfig.phoneNum
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
              url: this.$http.adornUrl(`/sys/baseconfig/${!this.dataForm.configId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'configId': this.dataForm.configId || undefined,
                'telephone': this.dataForm.telephone,
                'companyEmail': this.dataForm.companyEmail,
                'companyAddr': this.dataForm.companyAddr,
                'phoneNum': this.dataForm.phoneNum
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
