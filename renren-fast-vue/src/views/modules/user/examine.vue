<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-10-18 23:36:27
 * @LastEditTime: 2020-10-25 22:20:56
 * @LastEditors: yfye
-->
<template>
  <div class="mod-config">
    <el-tabs type="border-card">
      <el-tab-pane label="报名待审核">
        <StatusTable />
      </el-tab-pane>
      <el-tab-pane label="到岗待审核"> <StatusTable luyongType="1"/></el-tab-pane>
      <el-tab-pane label="已到岗"> <StatusTable /></el-tab-pane>
      <el-tab-pane label="报名失败驳回"> <StatusTable /></el-tab-pane>
      <el-tab-pane label="到岗驳回"> <StatusTable /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StatusTable from './StatusTable'
export default {
  data() {
    return {};
  },
   components: {
      StatusTable
    },
    methods: {

    }
};
</script>
