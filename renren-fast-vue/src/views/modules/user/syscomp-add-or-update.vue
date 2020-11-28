<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-11-23 21:43:28
 * @LastEditTime: 2020-11-26 22:41:05
 * @LastEditors: yfye
-->
<template>
  <el-dialog
    :title="我的好友"
     @close='cancel'
    :visible.sync="visible" >
     <el-tabs v-model="activeName" @tab-click="handleClick"  type="border-card" style="height:400px;overflow-y: scroll;">
    <el-tab-pane label="一级好友" name="first">
      <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="username"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="nickName"
      label="昵称"
      width="180">
    </el-table-column>
     <el-table-column
      prop="mobile"
      label="电话"
      width="180">
    </el-table-column>
    <el-table-column
      prop="sex"
      label="性别">
    </el-table-column>
<el-table-column
        prop="avatarUrl"
        header-align="center"
        align="center"
        label="头像">
         <template slot-scope="scope">
            <viewer>
                <img :src="scope.row.avatarUrl" key="占位图" style="width:30px">
            </viewer>
        </template>
      </el-table-column>
  </el-table>

    </el-tab-pane>
    <el-tab-pane label="二级好友" name="second">
      <el-table
    :data="tableData1"
    style="width: 100%"
    :row-class-name="tableRowClassName">
      <el-table-column
      prop="username"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="nickName"
      label="昵称"
      width="180">
    </el-table-column>
     <el-table-column
      prop="mobile"
      label="电话"
      width="180">
    </el-table-column>
    <el-table-column
      prop="sex"
      label="性别">
    </el-table-column>
     <el-table-column
        prop="avatarUrl"
        header-align="center"
        align="center"
        label="头像">
         <template slot-scope="scope">
            <viewer>
                <img :src="scope.row.avatarUrl" key="头像" style="width:30px">
            </viewer>
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
      },
    getTable(id,type){
      const that=this;
     this.$http({
              url: this.$http.adornUrl(type==1?`/app/myrelation/list?openid=${id}`:`/app/myrelation/nextlist?openid=${id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                 if(type==1){
                   that.tableData=data.page.list
                 }else{
                    that.tableData1=data.page.list
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
