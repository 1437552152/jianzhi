<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-11-23 21:43:28
 * @LastEditTime: 2020-11-28 14:05:19
 * @LastEditors: yfye
-->
<template>
  <el-dialog
     title="我的提现记录"
     @close='cancel'
    :visible.sync="visible" >
     <el-tabs v-model="activeName" @tab-click="handleClick"  type="border-card" style="height:400px;overflow-y: scroll;">
    <el-tab-pane label="提现记录" name="first">
      <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="txShStatue"
      label="提现状态">
       <template slot-scope="scope">
          <el-tag size="small">{{scope.row.txShStatue==0?'未审核':'审核通过'}}</el-tag>
           </template>
    </el-table-column>
    <el-table-column
      prop="cashoutTime"
      label="提现时间">
    </el-table-column>
     <el-table-column
      prop="cashoutMoney"
      label="提现金额">
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
              url: this.$http.adornUrl(`/my/mytx/list?openid=${id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                   that.tableData=data.page.list                          
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
