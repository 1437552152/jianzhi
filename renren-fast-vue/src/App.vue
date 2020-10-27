<!--
 * @Description: 
 * @Author: yfye
 * @Date: 2020-07-13 20:42:05
 * @LastEditTime: 2020-10-27 21:12:37
 * @LastEditors: yfye
-->
<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>
<style>
 .el-table .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.distpicker-address-wrapper select{
  padding:4px!important;
}
</style>>
