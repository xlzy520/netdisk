<template>
  <div class="netdiskHeader">
    <el-container>
      <el-header style="height:60px">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="20" style="font-size: 0;">
            <el-button type="warning" size="small" @click="openMyFileButton()" :class="{'active':active('/netdisk/folder_id/')}">我的文件</el-button>
            <el-button type="warning" size="small" @click="openMyShare()" :class="{'active':active('/netdisk/myshare')}">我的分享</el-button>
            <el-button type="warning" size="small" @click="$store.commit('changeDrawer',[true,'ltr'])">个人中心</el-button>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <el-link type="info" @click="quitUser()">
              <i class="el-icon-user"></i>退出
            </el-link>
          </el-col>
        </el-row>
      </el-header>
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {
    quitUser() {
      this.$confirm("确认退出系统，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "退出系统成功！!"
        });
        this.$router.replace("/user/login");
        this.$store.commit("quitUserInfo");
      }).catch(e=>{
        console.log("取消退出系统：",e);
      });
    },
    openMyFileButton(){
      let curRoute=this.$route.path;
      if(curRoute.includes('/netdisk/folder_id/0')){
        return false;
      }else{
        this.$router.replace('/netdisk/folder_id/0');
      }  
    },
    openMyShare(){
      let curRoute=this.$route.path;
      if(curRoute.includes('/netdisk/myshare')){
        return false;
      }else{
        this.$router.replace('/netdisk/myshare');
      }      
    },
    active(url){
      let curRoute=this.$route.path;
      if(curRoute.includes(url)){
        return true;
      }else{
        return false;
      }
    }
  },
  mounted(){
  }
};
</script>

<style scoped>
.netdiskHeader {
  max-width: 100%;
  width: 640px;
  height:100vh;
  margin: 0 auto;
  background: #fff;
}
.row-bg {
  padding: 10px 0;
  border-bottom: 1px solid #dcdfe6;
}
.el-button--warning:focus, .el-button--warning:hover{
  color:black;
  font-weight: bold;
}
.active{
  color:black;
  font-weight: bold;
}
</style>