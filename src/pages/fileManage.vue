<template>
  <el-main style="height:500px;padding-top: 20px;" justify="center">
    <!-- 数据懒加载 -->
    <div v-loading="loading" class="wait" style="height:300px;">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="name" label="昵称">
          <el-input v-model="searchForm.name" placeholder="昵称" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getFileList"
          >查询</el-button>
          <el-button type="info" @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
      <div class="displayContent">
        <el-table :data="fileList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="name" label="文件名" width="200" show-overflow-tooltip />
          <el-table-column prop="hash" label="Hash值" width="200" show-overflow-tooltip />
          <el-table-column prop="size" sortable label="大小" width="120">
            <template slot-scope="scope">
              <span>{{ renderSize(scope.row.size) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="user.name" label="上传用户" width="180" />
          <el-table-column prop="createdAt" sortable label="上传时间" width="180" />
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="small"
                @click="deleteShare(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </el-main>
</template>

<script>
import fileApi from '../api/file'

export default {
  name: 'Myshare',
  data() {
    return {
      loading: true,
      fileList: [],
      searchForm: {
        name: ''
      }
    }
  },
  computed: {
  },
  created() {
    this.loading = true
    this.getFileList()
  },
  methods: {
    renderSize(value) {
      if (value == null || value === '') {
        return '0 B'
      }
      const unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = 0
      const srcsize = parseFloat(value)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      let size = srcsize / Math.pow(1024, index)
      size = size.toFixed(2)// 保留的小数位数
      return size + unitArr[index]
    },
    fullShortUrl(shareUrl) {
      return window.location.origin + '/#/s/' + shareUrl
    },
    getFileList() {
      fileApi.getAdminFileList(this.searchForm).then(res => {
        this.loading = false
        this.fileList = res.list.rows
      }).finally(() => {
        this.loading = false
      })
    },
    resetForm() {
      this.$refs.searchForm.resetFields()
    },
    deleteShare(row) {
      this.$confirm(`删除该文件，继续吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fileApi.deleteFile({
          id: row.id
        }).then(res => {
          this.getFileList()
          this.$message1000('删除成功')
        })
      }).catch(error => {
        console.log('取消删除', error)
      })
    }
  }
}
</script>

<style scoped>

</style>
