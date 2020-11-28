<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-11-23 21:43:28
 * @LastEditTime: 2020-11-27 21:14:16
 * @LastEditors: yfye
-->
<template>
  <el-dialog
    :title="我的报名记录"
     @close='cancel'
    :visible.sync="visible" >
     <el-tabs v-model="activeName" @tab-click="handleClick"  type="border-card" style="height:400px;overflow-y: scroll;">
    <el-tab-pane label="全部" name="first">
      <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="luyongType"
      label="状态"
      width="180">
       <template slot-scope="scope">  
            <el-tag v-if="scope.row.luyongType==1">报名待审核</el-tag>
            <el-tag v-if="scope.row.luyongType==2">已录用,到岗待审核</el-tag>
            <el-tag v-if="scope.row.luyongType==3">已到岗</el-tag>
            <el-tag v-if="scope.row.luyongType==4">已结算</el-tag>
            <el-tag v-if="scope.row.luyongType==5">报名审核不通过</el-tag>
            <el-tag v-if="scope.row.luyongType==6">未到岗</el-tag>
            <el-tag v-if="scope.row.luyongType==7">未结算</el-tag>
        </template>
    </el-table-column>
    <el-table-column
      prop="jobTitle"
      label="职位名称"
      width="180">
    </el-table-column>

     <el-table-column
      prop="jobQycode"
      label="工作地点"
      width="180">
    </el-table-column>
    <el-table-column
      prop="cancelResion"
      label="驳回原因">
    </el-table-column>

 <el-table-column
      prop="luyongType"
      label="工资水平"
      width="180">
       <template slot-scope="scope">      
            <p>{{scope.row.jobPrice}}元/{{scope.row.jobPaytype===1?'时':scope.row.jobPaytype===2?'天':'月'}}</p>
        </template>
    </el-table-column>
  </el-table>

    </el-tab-pane>
    <el-tab-pane label="已录用" name="second">
      <el-table
    :data="tableData1"
    style="width: 100%"
    :row-class-name="tableRowClassName">
     <el-table-column
      prop="jobTitle"
      label="职位名称">
    </el-table-column>

     <el-table-column
      prop="jobQycode"
      label="工作地点">
    </el-table-column>
     <el-table-column
      prop="luyongType"
      label="工资水平">
       <template slot-scope="scope">      
            <p>{{scope.row.jobPrice}}元/{{scope.row.jobPaytype===1?'时':scope.row.jobPaytype===2?'天':'月'}}</p>
        </template>
    </el-table-column>
  </el-table>
    </el-tab-pane>
      <el-tab-pane label="已到岗" name="three">
      <el-table
    :data="tableData2"
    style="width: 100%"
    :row-class-name="tableRowClassName">
      <el-table-column
      prop="jobTitle"
      label="职位名称">
    </el-table-column>

     <el-table-column
      prop="jobQycode"
      label="工作地点">
    </el-table-column>
     <el-table-column
      prop="luyongType"
      label="工资水平">
       <template slot-scope="scope">      
            <p>{{scope.row.jobPrice}}元/{{scope.row.jobPaytype===1?'时':scope.row.jobPaytype===2?'天':'月'}}</p>
        </template>
    </el-table-column>
  </el-table>
    </el-tab-pane>
    <el-tab-pane label="已结算" name="four">
      <el-table
    :data="tableData3"
    style="width: 100%"
    :row-class-name="tableRowClassName">
       <el-table-column
      prop="jobTitle"
      label="职位名称">
    </el-table-column>

     <el-table-column
      prop="jobQycode"
      label="工作地点">
    </el-table-column>

 <el-table-column
      prop="monthPay"
      label="实发工资">
    </el-table-column>
 <el-table-column
      prop="jobBmbackprice"
      label="报名佣金">
    </el-table-column>
 <el-table-column
      prop="payForTime"
      label="结算时间">
    </el-table-column>
 <el-table-column
      prop="payForTime"
      label="共发工资">
     <template slot-scope="scope">      
            <p>{{Number(scope.row.monthPay)+Number(scope.row.jobBmbackprice)}}</p>
        </template>
    </el-table-column>
  </el-table>
    </el-tab-pane>
  </el-tabs>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        activeName: 'first',
        tableData: [],
        tableData1: [],
        tableData2: [],
        tableData3: [],
      }
    },
    mounted () {
      
    },
    methods: {
      cancel(){
          this.visible = false;
      },
      init (id) {   
         this.visible = true    
         this.getTable(id,1);
         this.getTable(id,2);
         this.getTable(id,3);
         this.getTable(id,4);
      },
    getTable(id,type){
      const that=this;
      let params={};
      params.openid=id;
     if(type==2){
        params.luyongType=2
     }else if(type==3){
         params.luyongType=3 
     }else if(type==4){
         params.luyongType=4
     }
     this.$http({
              url: this.$http.adornUrl('/my/myjob/myjobList'),
                    method: "post",
                    data: that.$http.adornData(params)
            }).then(({data}) => {
              if (data && data.code === 0) {
                 if(type==1){
                   that.tableData=data.list
                 }else if(type==2){
                    that.tableData1=data.list
                 }else if(type==3){
                    that.tableData2=data.list
                 }else if(type==4){
                    that.tableData3=data.list
                 }
                
              }
            })
    },

       handleClick(tab, event) {
      },
        tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    }
  }
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
