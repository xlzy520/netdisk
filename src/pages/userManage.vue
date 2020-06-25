<template>
  <el-main style="height:500px;padding-top: 20px;" justify="center">
    <!-- 数据懒加载 -->
    <div class="wait" v-loading="loading" style="height:300px;">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="name" label="昵称">
          <el-input v-model="searchForm.name" placeholder="昵称" />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              icon="el-icon-search"
              @click="getUserList"
          >查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
      <div class="displayContent">
        <el-table :data="userList" style="width: 100%">
          <el-table-column prop="id" label="用户ID"></el-table-column>
          <el-table-column prop="name" label="用户名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fileCount" label="文件数">
            <template slot-scope="scope">
              <el-tag type="danger">{{scope.row.files.length}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" sortable label="注册时间" width="180"></el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button @click="deleteShare(scope.row)" icon="el-icon-delete" type="danger"
                         size="small">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </el-main>
</template>

<script>
  import userApi from "../api/user";

  export default {
    name: "userManage",
    data() {
      return {
        loading: true,
        userList: [],
        searchForm: {
          name: '',
        },
      }
    },
    computed: {
    },
    created() {
      this.loading = true;
      this.getUserList();
    },
    methods: {
      getUserList() {
        userApi.getUserList(this.searchForm).then(res => {
            this.loading = false
            this.userList = res.list.rows;
          }).finally(() => {
            this.loading = false;
          });
      },
      resetForm() {
        this.$refs.searchForm.resetFields()
      },
      deleteShare(row) {
        this.$confirm(`删除该文件，继续吗？`, "确认删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          userApi.deleteUser({
            id: row.id,
          }).then(res => {
            this.getUserList()
            this.$message1000('删除成功')
          });
        }).catch(error => {
          console.log("取消删除", error)
        })
      },
    }
  };
</script>

<style scoped>

</style>
