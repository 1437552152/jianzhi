<template>
  <el-dialog :title="dataForm.compId ? '修改' : '新增'" @close="cancel" :visible.sync="visible">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="公司名称" prop="compName">
        <el-input v-model="dataForm.compName" placeholder="公司名称"></el-input>
      </el-form-item>

      <el-form-item label="公司经度" prop="compLot">
        <el-input v-model="dataForm.compLot" placeholder="公司经度"></el-input>
      </el-form-item>
      <el-form-item label="公司纬度" prop="compLat">
        <el-input v-model="dataForm.compLat" placeholder="公司纬度"></el-input>
      </el-form-item>

      <el-form-item label="公司联系电话" prop="compPnone">
        <el-input v-model="dataForm.compPnone" placeholder="公司联系电话"></el-input>
      </el-form-item>
      <el-form-item label="公司的福利待遇" prop="compWelfare">
        <el-checkbox-group v-model="dataForm.compWelfare">
          <el-checkbox label="包吃" name="compWelfare"></el-checkbox>
          <el-checkbox label="包住" name="compWelfare"></el-checkbox>
          <el-checkbox label="长白班" name="compWelfare"></el-checkbox>
          <el-checkbox label="带薪培训" name="compWelfare"></el-checkbox>
          <el-checkbox label="五险一金" name="compWelfare"></el-checkbox>
          <el-checkbox label="餐补" name="compWelfare"></el-checkbox>
          <el-checkbox label="住宿补贴" name="compWelfare"></el-checkbox>
          <el-checkbox label="两班倒" name="compWelfare"></el-checkbox>
          <el-checkbox label="免费培训" name="compWelfare"></el-checkbox>
          <el-checkbox label="交通补贴" name="compWelfare"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="公司地址" prop="compQycode">
        <v-distpicker
          :province="dataForm.compQycode.split(',').length===3?dataForm.compQycode.split(',')[0]:''"
          :city="dataForm.compQycode.split(',').length===3?dataForm.compQycode.split(',')[1]:''"
          :area="dataForm.compQycode.split(',').length===3?dataForm.compQycode.split(',')[2]:''"
          @selected="selected"
        ></v-distpicker>
      </el-form-item>
      <el-form-item label="公司详细地址" prop="compAddr">
        <el-input v-model="dataForm.compAddr" placeholder="公司详细地址"></el-input>
      </el-form-item>
      <div class="mod-demo-ueditor" v-if="flag">
        <el-form-item label="公司介绍" prop="compIncroduce">
          <script
            :id="ueId"
            class="ueditor-box"
            type="text/plain"
            style="width: 100%; height: 260px;"
          >
  {{dataForm.compIncroduce}}
          </script>
        </el-form-item>
      </div>
    </el-form>
    <!--  <p><el-button @click="getContent()">获得内容</el-button></p> -->

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import VDistpicker from "v-distpicker";
import ueditor from "ueditor";
export default {
  components: { VDistpicker },
  data() {
    return {
      visible: false,
      flag: false,
      dataForm: {
        compId: 0,
        compName: "",
        compIncroduce: "",
        compLot: "",
        compLat: "",
        compAddr: "",
        compPnone: "",
        compWelfare: [],
        compQycode: "",
        id: 0
      },
      ue: null,
      ueId: `J_ueditorBox_${new Date().getTime()}`,
      ueContent: "",
      dataRule: {
        compName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        compLot: [
          { required: true, message: "公司经度不能为空", trigger: "blur" }
        ],
        compLat: [
          { required: true, message: "公司纬度不能为空", trigger: "blur" }
        ],
        compAddr: [
          { required: true, message: "公司详细地址不能为空", trigger: "blur" }
        ],
        compPnone: [
          { required: true, message: "公司联系电话不能为空", trigger: "blur" }
        ],
        compQycode: [
          { required: true, message: "公司地址不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    cancel() {
      this.visible = false;
      this.ueContent = "";
      this.dataForm.compIncroduce = "";
      this.$emit("refreshDataList");
    },
    init(id) {
      this.dataForm.compId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();

        if (this.dataForm.compId) {
          this.$http({
            url: this.$http.adornUrl(
              `/comp/syscomp/info/${this.dataForm.compId}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.compName = data.sysComp.compName;
              this.dataForm.compIncroduce = data.sysComp.compIncroduce;
              this.ueContent = data.sysComp.compIncroduce;
              this.dataForm.compLot = data.sysComp.compLot;
              this.dataForm.compLat = data.sysComp.compLat;
              this.dataForm.compAddr = data.sysComp.compAddr;
              this.dataForm.compPnone = data.sysComp.compPnone;
              this.dataForm.compWelfare = data.sysComp.compWelfare
                ? data.sysComp.compWelfare.split(",")
                : [];
              this.dataForm.compQycode = data.sysComp.compQycode;
              this.flag = true;
              this.visabled();
            } else {
              this.flag = true;
              this.visabled();
            }
          });
        } else {
          this.flag = true;
          this.visabled();
        }
      });
    },
    selected(data) {
      this.dataForm.compQycode = `${data.province.value},${data.city.value},${data.area.value}`;
    },
    // 表单提交
    dataFormSubmit() {
      this.getContent();
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/comp/syscomp/${!this.dataForm.compId ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              compId: this.dataForm.compId || undefined,
              compName: this.dataForm.compName,
              compIncroduce: this.dataForm.compIncroduce,
              compLot: this.dataForm.compLot,
              compLat: this.dataForm.compLat,
              compAddr: this.dataForm.compAddr,
              compPnone: this.dataForm.compPnone,
              compWelfare: this.dataForm.compWelfare.join(","),
              compQycode: this.dataForm.compQycode
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.ueContent = "";
                  this.dataForm.compIncroduce = "";
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    visabled() {
      this.$nextTick(() => {
        this.ue = ueditor.getEditor(this.ueId, {
          zIndex: 3000
        });
      });
    },
    getContent() {
      this.ue.ready(() => {
        this.ueContent = this.ue.getContent();
        this.dataForm.compIncroduce = this.ue.getContent();
      });
    },
    destroyed() {
      this.flag = false;
      this.ueContent = "";
      this.dataForm.compIncroduce = "";
    }
  }
};
</script>
<style lang="scss">
.distpicker-address-wrapper select {
  height: 50px;
  padding: 3px;
}
.mod-demo-ueditor {
  position: relative;
  z-index: 510;
  > .el-alert {
    margin-bottom: 10px;
  }
}
</style>