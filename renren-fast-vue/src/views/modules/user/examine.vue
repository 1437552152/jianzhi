<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-10-18 23:36:27
 * @LastEditTime: 2020-10-26 22:28:24
 * @LastEditors: yfye
-->
<template>
  <div class="mod-config">
    <el-tabs type="border-card"  @tab-click="handleClick" v-model="handleName" >
      <el-tab-pane label="报名待审核" name="first">
        <StatusTable luyongType="1" v-if="handleName=='first'"/>
      </el-tab-pane>
      <el-tab-pane label="已录用,到岗待审核" name="two"> <StatusTable luyongType="2"   v-if="handleName=='two'"/></el-tab-pane>
      <el-tab-pane label="已到岗"  name="three"> <StatusTable luyongType="3"  v-if="handleName=='three'"/></el-tab-pane>
      <el-tab-pane label="报名审核不通过"  name="five"> <StatusTable luyongType="5"   v-if="handleName=='five'"/></el-tab-pane>
      <el-tab-pane label="未到岗" name="six"> <StatusTable luyongType="6"   v-if="handleName=='six'"/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StatusTable from './StatusTable'
export default {
  data() {
    return {
      handleName:"first"
    };
  },
   components: {
      StatusTable
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab,event)
        this.handleName=tab.name;
      }
    }
};
</script>
