<template>
  <div class="shareViewBox">
    <div v-if="hasData" class="shareFileView">
      <div v-if="userShareView['shareType']=='private'" class="needPassword">
        <i class="el-icon-warning-outline" />
        <p>文件受密码保护，请输入密码继续下载</p>
        <el-input
          v-model="shareKey"
          placeholder="请输入提取码"
          show-password
          style="width: 50%;text-align:center"
        />
        <el-button type="primary" :disabled="disabled" @click="checkShareKey">确认</el-button>
      </div>
      <div v-else-if="userShareView['shareType']=='open'" class="noPaswword">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ userShareView.name }}</span>
          </div>
          <div class="text item" style="text-align:left">
            <p>文件大小：{{ renderSize(userShareView.size) }}</p>
            <p>文件Hash值：{{ userShareView.hash }}</p>
            <p>分享时间：{{ userShareView.updatedAt }}</p>
            <p>分享用户：{{ userShareView.user.name }}</p>
            <p style="text-align:center">
              <el-button type="danger" icon="el-icon-download" @click="fullDownloadUrl(userShareView)">下载</el-button>
            </p>
          </div>
        </el-card>
      </div>
    </div>
    <div v-else class="shareNoFound">
      <i class="el-icon-warning-outline" />
      <p style="color: #b3b3b3;">来晚啦...文件取消分享了</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import fileApi from '../api/file'
export default {
  name: 'ShareView',
  filters: {
    userNameHidden(oldUserName) {
      return (
        oldUserName &&
        oldUserName.replace(/(.)(.+)/g, ($1, $2, $3) => {
          return $2 + '*'.repeat($3.length)
        })
      )
    }
  },
  data() {
    return {
      userShareView: null,
      hasData: false,
      shareKey: '',
      disabled: false
    }
  },
  computed: {},
  watch: {
    '$route.params.shareUrl'() {
      this.getUserShareView()
    }
  },
  created() {
    this.getUserShareView()
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
    getUserShareView() {
      fileApi.getShareDetail({ shareUrl: this.$route.params.shareUrl }).then(res => {
        this.userShareView = res
        this.hasData = true
      })
    },
    checkShareKey() {
      this.disabled = true
      fileApi.getShareDetail({
        shareUrl: this.$route.params.shareUrl,
        shareKey: this.shareKey
      }).then(res => {
        this.userShareView = res
        this.userShareView['shareType'] = 'open'
        this.hasData = true
      })
    },
    fullDownloadUrl(row) {
      axios({
        url: '/api/' + row.path,
        method: 'get',
        responseType: 'blob'
      }).then(res => {
        const url = URL.createObjectURL(res.data)
        const a = document.createElement('a')
        a.href = url
        a.download = row.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
    }
  }
}
</script>

<style scoped>
.shareViewBox {
  max-width: 100%;
  width: 640px;
  margin: 0 auto;
  padding-top:100px;
  text-align: center;
}
.shareViewBox .el-icon-warning-outline {
  width: 70px;
  height: 74px;
  line-height: 70px;
  font-size: 50px;
}
</style>
