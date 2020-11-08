<template>
  <el-dialog title="结算" :close-on-click-modal="false" :visible.sync="visible">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="所结工资时间" prop="payForTime">
        <el-date-picker v-model="dataForm.payForTime" type="month" placeholder="时间" :disabled="id?true:false"></el-date-picker>
      </el-form-item>

      <el-form-item label="当月工资" prop="monthPay">
        <el-input v-model="dataForm.monthPay" placeholder="请输入当月工资" :disabled="id?true:false">
          <template slot="append">应发:{{params.jobPrice}}元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="一级分享佣金" prop="jobFxbackprice">
        <el-input v-model="dataForm.jobFxbackprice" placeholder="请输入一级分享佣金" :disabled="id?true:false">
          <template slot="append">应发:{{params.jobFxbackprice}}元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="二级分享佣金" prop="jobFxejbackprice">
        <el-input v-model="dataForm.jobFxejbackprice" placeholder="请输入二级分享佣金" :disabled="id?true:false">
          <template slot="append">应发:{{params.jobFxejbackprice}}元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="报名佣金" prop="jobBmbackprice">
        <el-input v-model="dataForm.jobBmbackprice" placeholder="请输入报名佣金" :disabled="id?true:false">
          <template slot="append">应发:{{params.jobBmbackprice}}元</template>
        </el-input>
      </el-form-item>
    
        <el-form-item label="是否上传工资条"  prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="工资条上传" prop="paySlip" v-if="dataForm.type==1">
        <el-upload
          class="avatar-uploader"
          :action="PicUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-if="dataForm.paySlip"
            :src="dataForm.paySlip"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="备注" prop="payStubsBz">
        <el-input type="textarea" v-model="dataForm.payStubsBz" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment';
export default {
  data() {
    return {
      visible: false,
       PicUrl: `${window.SITE_CONFIG.baseUrl}/sys/syspic/fileUpload`,
       params:{},
       id:0,
      dataForm: {
        jobBmbackprice: "", //报名佣金
        jobFxbackprice: "", //一级佣金
        jobFxejbackprice: "",//二级佣金
        jobTitle: "", //工作名称
        monthPay: "",//结算工资
        paySlip: "", //工资条图片地址
        payStubsBz:"", //工资记录备注
        payForTime:'',  //所结时间
        type:"2"
      },
      dataRule: {
        jobBmbackprice: [
          { required: true, message: "报名佣金不能为空", trigger: "blur" }
        ],
        jobFxbackprice: [
          { required: true, message: "一级佣金不能为空", trigger: "blur" }
        ],
         jobFxejbackprice: [
          { required: true, message: "二级佣金不能为空", trigger: "blur" }
        ],
         monthPay: [
          { required: true, message: "工资不能为空", trigger: "blur" }
        ],
         monthPay: [
          { required: true, message: "工资不能为空", trigger: "blur" }
        ],
       payForTime: [
          { required: true, message: "所结时间不能为空", trigger: "blur" }
        ],
        paySlip: [
          { required: true, message: "请选择是否上传工资条", trigger: "change" }
        ],
      }
    };
  },
  methods: {
     handleAvatarSuccess(res, file) {
      if (!res.code) {
        this.dataForm.paySlip = `${window.SITE_CONFIG.upLoadUrl}${res.url}`;
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
    init(params) {
      this.visible = true;
      this.id =0;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
          this.$http({
            url: this.$http.adornUrl(`/job/sysjob/info/${this.$route.query.jobId}`),
            method: "get"
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.params=data.sysJob;
             this.dataForm.jobTitle = data.sysJob.jobTitle;
            }
          });
      });
       if(params){
         this.id=params.payStubsId;
         const that=this;
        for(let key in that.dataForm){
          that.$nextTick(() => {
            if(key!='paySlip'){
               that.dataForm[key]=params[key];        
            }
             
          })     
        }
         if(params['paySlip']){      
            that.$nextTick(() => {    
              that.dataForm.type="1";
              that.dataForm.paySlip=params['paySlip'];
            })
        }else{
          that.$nextTick(() => {    
              that.dataForm.type="2";
            })
        }
       }
    },
   // 表单提交
    dataFormSubmit() {
      const that=this;
      this.$confirm(`一旦结算将不可更改，确定结算该月的工资吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      that.$refs["dataForm"].validate(valid => {
        if (valid) {
          
          that.$http({
            url: that.$http.adornUrl(that.id?'/my/mypaystubs/update':
              `/my/mypaystubs/save`
            ),
            method: "post",
            data: that.$http.adornData({
               'jobId':that.$route.query.jobId,
               'userId':that.$route.query.userId,
               'jobBmbackprice':that.dataForm.jobBmbackprice,   //报名佣金
                "jobFxbackprice":that.dataForm.jobFxbackprice,   //一级佣金
                "jobFxejbackprice":that.dataForm.jobFxejbackprice,   //二级佣金
                "jobTitle":that.dataForm.jobTitle,    //工作名称
                "monthPay":that.dataForm.monthPay,   //结算的日期
                "paySlip":that.dataForm.type==1?that.dataForm.paySlip:'',    //工资条图片地址
                "payStubsBz":that.dataForm.payStubsBz,  //工资记录备注
                'payForTime':moment(that.dataForm.payForTime).format("YYYY-MM"),
                'payStubsId':that.id?that.id:'',
                'openid':that.$route.query.jobId,
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              that.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  that.visible = false;
                  that.$emit("refreshDataList");
                }
              });
            } else {
              that.$message.error(data.msg);
            }
          });
        }
      });
      });
    }
  }
};
</script>
<style scoped>
.avatar{
  max-width: 200px;
}
</style>>