<template>
  <el-dialog
    :title="!dataForm.jobId ? '新增' : '修改'"
    @close='cancel'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="公司名称" prop="compId">
       <el-select v-model="dataForm.compId" filterable  placeholder="请选择该职位所归属的公司名称">
          <el-option :label="item.compName" :value="item.compId" v-for="(item,index) in dataList" :key="index"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="工作经度" prop="jobLot">
      <el-input v-model="dataForm.jobLot" placeholder="工作经度"></el-input>
    </el-form-item>
    <el-form-item label="工作纬度" prop="jobLat">
      <el-input v-model="dataForm.jobLat" placeholder="工作纬度"></el-input>
    </el-form-item>

    <el-form-item label="工作地址" prop="jobQycode">
       <v-distpicker :province="dataForm.jobQycode.split(',').length===3?dataForm.jobQycode.split(',')[0]:''" :city="dataForm.jobQycode.split(',').length===3?dataForm.jobQycode.split(',')[1]:''" :area="dataForm.jobQycode.split(',').length===3?dataForm.jobQycode.split(',')[2]:''" @selected='selected'></v-distpicker>
    </el-form-item>

    <el-form-item label="工作详细地址" prop="jobAddress">
      <el-input v-model="dataForm.jobAddress" placeholder="请输入工作地点"></el-input>
    </el-form-item>
    
    <el-form-item label="工作薪资" prop="jobPrice">
        <el-input-number v-model="dataForm.jobPrice"  :min="0"  label="请输入工作薪资" ></el-input-number>
    </el-form-item>
    <el-form-item label="工资结算方式" prop="jobPaytype">
      <el-radio-group v-model="dataForm.jobPaytype">
        <el-radio label="时"></el-radio>
        <el-radio label="天"></el-radio>
        <el-radio label="月"></el-radio>
       </el-radio-group>
    </el-form-item>

    <el-form-item label="职位种类" prop="jobtypeId">
       <el-select v-model="dataForm.jobtypeId" filterable  placeholder="请选择该职位种类">
          <el-option :label="item.typeName" :value="item.jobtypeId" v-for="(item,index) in jobTypeList" :key="index"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="工作标题" prop="jobTitle">
      <el-input v-model="dataForm.jobTitle" placeholder="工作标题"></el-input>
    </el-form-item>
  
    <el-form-item label="报名佣金" prop="jobBmbackprice">
        <el-input-number v-model="dataForm.jobBmbackprice"  :min="0"  label="请输入报名佣金"></el-input-number>
    </el-form-item>

    <el-form-item label="分享佣金" prop="jobFxbackprice">
        <el-input-number v-model="dataForm.jobFxbackprice"  :min="0"  label="请输入分享佣金"></el-input-number>
    </el-form-item>

    <el-form-item label="性别限制" prop="jobSex">
      <el-radio-group v-model="dataForm.jobSex">
        <el-radio label="只招男生"></el-radio>
        <el-radio label="只招女生"></el-radio>
        <el-radio label="男女不限"></el-radio>
       </el-radio-group>
    </el-form-item>

    <el-form-item label="工作开始时间" prop="jobStartTime">
        <el-date-picker
      v-model="dataForm.jobStartTime"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
    </el-form-item>
    <el-form-item label="工作结束时间" prop="jobEndTime">
      <el-date-picker
            v-model="dataForm.jobEndTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
    </el-form-item>


    <el-form-item label="预招聘人数" prop="jobPrezpNum">
      <el-input v-model="dataForm.jobPrezpNum" placeholder="请输入预招聘人数"></el-input>
    </el-form-item>

   <!--  <el-form-item label="合作方式" prop="jobBmfs">
      <el-input v-model="dataForm.jobBmfs" placeholder="请输入合作方式" type="textarea"></el-input>
    </el-form-item> -->

 <!--    <el-form-item label="职位描述" prop="jobDesc">
      <el-input v-model="dataForm.jobDesc" placeholder="职位描述" type="textarea"></el-input>
    </el-form-item>
 -->
    <el-form-item label="职位必备技能" prop="jobRequireSkill">
      <el-input v-model="dataForm.jobRequireSkill" placeholder="请输入职位必备技能" type="textarea"></el-input>
    </el-form-item>


    <el-form-item label="工作备注" prop="jobBz">
      <el-input v-model="dataForm.jobBz" placeholder="请输入工作备注" type="textarea"></el-input>
    </el-form-item>

 <div class="mod-demo-ueditor" v-if="flag">
     <el-form-item label="工作内容" prop="jobIntroduce">
      <script :id="ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 260px;">{{dataForm.jobIntroduce}}</script>
  </el-form-item>
 </div>
</el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import VDistpicker from 'v-distpicker'
import moment from 'moment';
 import ueditor from 'ueditor'
  export default {
    components: { VDistpicker },
    data () {
      return {
        visible: false,
        flag:false,
        dataForm: {
          jobId: 0,
          compId: '',
          jobLot:'',
          jobLat:'',
          jobAddress: '',
          jobIntroduce: '',
          jobtypeId: '',
          jobDesc: '',
          jobRequireSkill: '',
          jobTitle: '',
          jobPrice: '',
          jobStartTime: '',
          jobEndTime: '',
          jobBmfs: '',
          jobBz: '',
          jobPrezpNum:0,
          jobFxbackprice:0,
          jobBmbackprice:0,
          jobStatue:1,
          jobSex:'男女不限',
          jobPaytype:'月',
          jobQycode:''
        },
          ue: null,
          ueId: `J_ueditorBox_${new Date().getTime()}`,
          ueContent: '',
        dataRule: {
          compId: [
            { required: true, message: '公司名称', trigger: 'blur' }
          ],
          jobAddress: [
            { required: true, message: '工作地点不能为空', trigger: 'blur' }
          ],
          jobIntroduce: [
            { required: true, message: '工作介绍不能为空', trigger: 'blur' }
          ],
          jobtypeId: [
            { required: true, message: '职位种类主键不能为空', trigger: 'blur' }
          ],
         /*  jobDesc: [
            { required: true, message: '职位描述不能为空', trigger: 'blur' }
          ], */
          jobRequireSkill: [
            { required: false, message: '职位必备技能不能为空', trigger: 'blur' }
          ],
          jobTitle: [
            { required: true, message: '工作标题不能为空', trigger: 'blur' }
          ],
          jobPrice: [
            { required: true, message: '工作薪资不能为空', trigger: 'blur' }
          ],
          jobStartTime: [
            { required: true, message: '工作开始时间不能为空', trigger: 'blur' }
          ],
          jobEndTime: [
            { required: true, message: '工作结束时间不能为空', trigger: 'blur' }
          ],
        /*   jobBmfs: [
            { required: true, message: '工作报名方式不能为空', trigger: 'blur' }
          ], */
          jobBz: [
            { required: false, message: '工作备注不能为空', trigger: 'blur' }
          ],
          jobPrezpNum: [
            { required: true, message: '请填写预招聘人数', trigger: 'blur' }
          ],
         jobFxbackprice: [
            { required: true, message: '分享佣金不能为空', trigger: 'blur' }
          ],
          jobBmbackprice: [
            { required: true, message: '报名佣金不能为空', trigger: 'blur' }
          ],
           jobSex: [
            { required: true, message: '性别限制必填', trigger: 'blur' }
          ],
          jobPaytype: [
            { required: true, message: '工资结算方式必填', trigger: 'blur' }
          ],
           jobLot: [
            { required: true, message: '工作经度必填', trigger: 'blur' }
          ],
           jobpLat: [
            { required: true, message: '工作纬度必填', trigger: 'blur' }
          ],
            jobQycode: [
            { required: true, message: '工作地址不能为空', trigger: 'blur' }
          ]     
        },
         dataList:[],
         jobTypeList:[]
      }
    },
    methods: {
      init (id) {
        this.dataForm.jobId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.jobId) {
            this.$http({
              url: this.$http.adornUrl(`/job/sysjob/info/${this.dataForm.jobId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.compId = data.sysJob.compId
                this.dataForm.jobAddress = data.sysJob.jobAddress
                this.dataForm.jobIntroduce = data.sysJob.jobIntroduce
                this.dataForm.jobtypeId = data.sysJob.jobtypeId
                this.dataForm.jobDesc = data.sysJob.jobDesc
                this.dataForm.jobRequireSkill = data.sysJob.jobRequireSkill;
                this.dataForm.jobTitle = data.sysJob.jobTitle
                this.dataForm.jobPrice = data.sysJob.jobPrice
                this.dataForm.jobStartTime = moment(data.sysJob.jobStartTime);
                this.dataForm.jobEndTime =  moment(data.sysJob.jobEndTime);
                this.dataForm.jobBmfs = data.sysJob.jobBmfs
                this.dataForm.jobBz = data.sysJob.jobBz;
                this.dataForm.jobPrezpNum = data.sysJob.jobPrezpNum;
                this.dataForm.jobFxbackprice = data.sysJob.jobFxbackprice;
                this.dataForm.jobBmbackprice = data.sysJob.jobBmbackprice;     
                this.dataForm.jobStatue = data.sysJob.jobStatue; 
                this.dataForm.jobSex = data.sysJob.jobSex===3?'男女不限':(data.sysJob.jobSex===2?'只招女生':'只招男生');   
                this.dataForm.jobPaytype = data.sysJob.jobPaytype===3?'月':(data.sysJob.jobPaytype===2?'天':'时'); 
                
                 this.dataForm.jobLot = data.sysJob.jobLot;
                 this.dataForm.jobLat = data.sysJob.jobLat;

                  this.dataForm.jobQycode = data.sysJob.jobQycode
                  this.flag=true;
                this.visabled();
              }else{
                this.flag=true;
                this.visabled();  
              }
            })
          }else{
             this.flag=true;
             this.visabled();
          }
        })
      },
        selected(data){
        this.dataForm.jobQycode=`${data.province.value},${data.city.value},${data.area.value}`
       },
      // 表单提交
      dataFormSubmit () {
          this.getContent();
        this.$refs['dataForm'].validate((valid) => {
          
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/job/sysjob/${!this.dataForm.jobId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'jobId': this.dataForm.jobId || undefined,
                'compId': this.dataForm.compId,
                'jobAddress': this.dataForm.jobAddress,
                'jobIntroduce': this.dataForm.jobIntroduce,
                'jobtypeId': this.dataForm.jobtypeId,
                'jobDesc': this.dataForm.jobDesc,
                'jobRequireSkill': this.dataForm.jobRequireSkill,
                'jobTitle': this.dataForm.jobTitle,
                'jobPrice': this.dataForm.jobPrice,
                'jobStartTime': moment(this.dataForm.jobStartTime).format("YYYY-MM-DD HH:mm:ss"),
                'jobEndTime': moment(this.dataForm.jobEndTime).format("YYYY-MM-DD HH:mm:ss"),
                'jobBmfs': this.dataForm.jobBmfs,
                'jobBz': this.dataForm.jobBz,
                'jobPrezpNum':this.dataForm.jobPrezpNum,
                'jobFxbackprice':this.dataForm.jobFxbackprice,
                'jobBmbackprice':this.dataForm.jobBmbackprice,
                'jobStatue':this.dataForm.jobStatue, 
                'jobSex': this.dataForm.jobSex==='男女不限'?3:(this.dataForm.jobSex==='只招女生'?2:1), 
                'jobPaytype': this.dataForm.jobPaytype==='月'?3:(this.dataForm.jobPaytype==='天'?2:1), 
                'jobLot':this.dataForm.jobLot,
                'jobLat':this.dataForm.jobLat,
                'jobQycode': this.dataForm.jobQycode   
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                     this.visible = false;
                    this.ueContent='';
                    this.dataForm.jobIntroduce='';
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
       cancel(){
          this.visible = false;
          this.ueContent='';
          this.dataForm.jobIntroduce='';
          this.$emit('refreshDataList')
      },
      // 获取数据列表
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/comp/syscomp/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit':1000
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
          } else {
            this.dataList = []
          }
        })
      },
          // 获取职位种类列表
      jobTypeListRequ () {
        const that=this;
        this.$http({
          url: this.$http.adornUrl('/job/sysjobtype/getListForSelect'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            that.jobTypeList = data.list
          } else {
            that.jobTypeList = []
          }
        })
      },
         visabled(){
        this.$nextTick(() => {
            this.ue = ueditor.getEditor(this.ueId, {
                    zIndex: 3000,
                    serverUrl:`${window.SITE_CONFIG.baseUrl}/comp/syscomp/list`,
                  });
        })
      },
       getContent () {
        this.ue.ready(() => {
          this.ueContent = this.ue.getContent();
          this.dataForm.jobIntroduce=this.ue.getContent();
        })
      },
      destroyed () {
            this.flag=false;
            this.ueContent='';
           this.dataForm.jobIntroduce='';
}
    },
     created () {
      this.jobTypeListRequ();
      this.getDataList();
    },
  }
</script>
