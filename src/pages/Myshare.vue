<template>
  <el-main style="height:500px;padding-top:0;" justify="center">
    <!-- 数据懒加载 -->
    <div
      class="wait"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="height:300px;"
    >
      <div class="displayContent" v-if="displayContent">
        <!-- 文件分享内容区 -->
        <el-collapse accordion>
            <el-collapse-item v-for="(item,index) in filterUserShareList" :key="item.Id">
                <template slot="title">
                        <div class="shareType" style="width: 15px;color: #7fb2ff;">
                            <i class="el-icon-lock" ></i>
                        </div>
                        <div class="shareFileImg" style="position: relative;top: 8px;width: 30px;">
                            <img :src="fullImgSrc(item['File_ext'])" :width="26" height="26" />
                        </div>
                        <div class="shareFileName" v-if="item.Share_status">
                            {{item.File_name}}
                        </div>
                        <div class="shareFileName" v-else style="color:red">
                            分享已过期
                        </div>
                </template>
                <div class="shareFilUrl"  v-if="item.Share_status">
                    <span>链接</span> ：<el-link type="primary" :underline="false" style="vertical-align: baseline;">{{fullShortUrl(item.Share_url)}}</el-link>
                    <span v-if="item.Share_type=='private'"><br />提取码：{{item.key}}</span>
                    <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 20px;" @click="deleteShare(item['Id'],index)"></el-button>
                </div>
                <div class="shareFilUrl" v-else>
                    <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 20px;" @click="deleteShare(item['Id'],index)"></el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
      </div>
      <div v-else>
        <el-row type="flex" class="row-bg">
          <el-col
            style="text-shadow: #FF0000 0 0 10px;font-size: 60px;font-weight: bold;color: white;position: relative;text-align: center;margin-top: 20%;"
          >暂无分享链接</el-col>
        </el-row>
      </div>
    </div>

    <!-- Drawer 抽屉 -->
    <el-drawer
      :visible="$store.getters.getDrawerInfo['open']"
      :direction="$store.getters.getDrawerInfo['direction']"
      @close="closeDrawer()"
    >
      <!-- 用户信息卡 -->
      <div class="userInfo">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h1>用户信息卡：</h1>
          </div>
          <div class="text item">
            <p>用户名：{{$store.getters.getUserInfo['Username']}}</p>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </el-main>
</template>

<script>
import api from "../fetch/api";
import axios from "axios";
export default {
  name: "myshare",
  data() {
    return {
        loading: true,
        displayContent:false,
        activeName: '1',
        userShareList:null
    }
  },
  computed:{
      filterUserShareList(){
        return (
            this.userShareList &&
            this.userShareList.filter((item, value) => {
                return true;
            })
        );
      }
  },
  created(){
    this.loading = true;
    this.displayContent = true;
    this.getUserShareList();
  },
  methods: {
    fullImgSrc(File_ext) {
      return `${axios.defaults.baseURL}/static/icon/${File_ext}.png`;
    },
    fullShortUrl(shareUrl){
        return window.location.origin+'/s/'+shareUrl;
    },
    getUserShareList(){
        api.getUserShareList({ userId: this.$store.getters.getUserInfo.Id}).then(res => {
          setTimeout(() => {
            if (res.length == 0) this.displayContent = false;
            else this.displayContent = true;
            this.loading = false;
            this.userShareList = res;
          }, 600);
        })
        .catch(error => {
          this.displayContent = false;
          this.loading = false;
          console.log("获取用户分享列表失败；",error);
        });
    },
    deleteShare(share_id,shareIndex){
        this.$confirm(`取消分享后，该条分享记录将被删除，好友将无法再访问此分享链接，继续吗？`, "确认取消分享", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
          api.deleteShare({share_id}).then(res => {
              if (res.code == 1) {
                this.userShareList.splice(shareIndex, 1);
                this.$message({
                  type: "success",
                  message: res.msg
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                });
              }
            });
        }).catch(error=>{
            console.log("取消分享",error)
        })
    },
    closeDrawer() {
      this.$store.commit("changeDrawer", [false]);
    },
  }
};
</script>

<style scoped>
.el-collapse:first-child{
    border-top:none;
}
</style>
