<template>
  <div class="netdiskHeader">
    <el-container>
      <el-header style="height:60px">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="16" style="font-size: 0;">
            <el-menu :default-active="activeIndex" router class="el-menu-demo" mode="horizontal" @select="handleSelect">
              <el-menu-item index="index">我的文件</el-menu-item>
              <el-menu-item index="myshare">我的分享</el-menu-item>
              <el-menu-item v-if="isAdmin" index="user">用户管理</el-menu-item>
              <el-menu-item v-if="isAdmin" index="files">文件管理</el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="8" style="text-align:right;">
            <div style="display: flex; justify-content: space-between">
              <el-link type="info" href="https://aliyunvi.com/filehash" target="_blank">第三方文件hash值查询</el-link>
              <el-tag style="margin-right: 20px">{{ userInfo.name }} </el-tag>
              <el-button type="danger" size="small" icon="user" @click="quitUser">退出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <router-view />
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeIndex: 'index'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    isAdmin() {
      return this.userInfo.role === 'admin'
    }
  },
  mounted() {
    const route = this.$route.path.split('/')[2]
    this.handleSelect(route)
  },
  methods: {
    quitUser() {
      this.$confirm('确认退出系统，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出系统成功！!'
        })
        this.$router.replace('/login')
        this.$store.commit('quitUserInfo')
      }).catch(e => {
        console.log('取消退出系统：', e)
      })
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key
    }
  }
}
</script>

<style>
  .el-menu--horizontal>.el-menu-item{
    height: 40px;
    line-height: 40px;
  }
  .el-menu.el-menu--horizontal{
    border-bottom: none;
  }
.netdiskHeader {
  max-width: 100%;
  width: 1160px;
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
