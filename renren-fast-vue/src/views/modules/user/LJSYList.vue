<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-11-23 21:43:28
 * @LastEditTime: 2020-11-30 22:24:59
 * @LastEditors: yfye
-->
<template>
  <el-dialog
     title="我的累计收益"
     @close='cancel'
    :visible.sync="visible" >
     <el-tabs v-model="activeName" @tab-click="handleClick"  type="border-card" style="height:400px;overflow-y: scroll;">
    <el-tab-pane label="累计收益记录" name="first">
      <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="jobTitle"
      label="职位标题">
      <!--  <template slot-scope="scope">
          <el-tag size="small">{{scope.row.txShStatue==0?'未审核':'审核通过'}}</el-tag>
           </template> -->
    </el-table-column>
    <el-table-column
      prop="userName"
      label="好友姓名">
    </el-table-column>
     <el-table-column
      prop="getReasion"
      label="奖励来源">
    </el-table-column>
      <el-table-column
      prop="payTime"
      label="结算时间">
    </el-table-column>

     <el-table-column
      prop="payNum"
      label="金额(元)">
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
        this.getTable(id);
      },
    getTable(id,type){
      const that=this;
     this.$http({
              url: this.$http.adornUrl(`/app/myshouyi/getLjShouYi?openid=${id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                   that.tableData=data.list                          
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
