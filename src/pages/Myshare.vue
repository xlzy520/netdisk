<template>
  <el-main style="height:500px;padding-top:0;" justify="center">
    <!-- 数据懒加载 -->
    <div class="wait" v-loading="loading" style="height:300px;">
      <div class="displayContent">
        <el-table :data="userShareList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="name" label="文件名" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hash" label="Hash值" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="shareType" label="分享类型" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.shareType === 'open' ? 'primary': 'warning'">
                {{scope.row.shareType === 'open' ? '公开分享': '私密分享'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="shareKey" label="密码" width="120"></el-table-column>
          <el-table-column prop="path" label="分享地址" width="270">
            <template slot-scope="scope">
              <el-link type="primary" target="_blank" :href="fullShortUrl(scope.row.shareUrl)">{{fullShortUrl(scope.row.shareUrl)}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button @click="deleteShare(scope.row)" icon="el-icon-delete" type="danger"
                         size="small">取消分享
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </el-main>
</template>

<script>
  import fileApi from "../api/file";

  export default {
    name: "myshare",
    data() {
      return {
        loading: true,
        userShareList: null,
      }
    },
    computed: {
    },
    created() {
      this.loading = true;
      this.getUserShareList();
    },
    methods: {
      fullShortUrl(shareUrl) {
        return window.location.origin + '/#/s/' + shareUrl;
      },
      getUserShareList() {
        fileApi.getShareFile().then(res => {
            this.loading = false
            this.userShareList = res.list.rows;
          }).finally(() => {
            this.loading = false;
          });
      },
      deleteShare(row) {
        this.$confirm(`取消分享后，该条分享记录将被删除，好友将无法再访问此分享链接，继续吗？`, "确认取消分享", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          fileApi.updateFile({
            id: row.id,
            shareKey: null,
            shareStatus: null,
            shareUrl: null,
            shareType: null,
          }).then(res => {
            this.getUserShareList()
            this.$message1000('取消分享成功')
          });
        }).catch(error => {
          console.log("取消分享", error)
        })
      },
    }
  };
</script>

<style scoped>

</style>
