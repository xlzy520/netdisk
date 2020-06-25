<template>
  <el-main style="height:calc(100vh - 60px);padding-top: 20px;" justify="center">
    <!-- 上传 搜索 新建文件 -->
    <el-row type="flex" class="row-bg">
      <el-button type="primary" icon="el-icon-upload" size="medium"
                 @click="openUpload">上传</el-button>
      <el-button type="success" icon="el-icon-refresh" size="medium"
                 @click="getUserFile(true)">刷新</el-button>
    </el-row>
    <el-dialog :visible.sync="visible" title="文件上传" @close="close" width="645px">
      <!-- 文件上传框 -->
      <el-upload class="upload-demo" drag multiple ref="upload-demo"
                 action="api/file/upload"
                 :on-success="handleSuccess">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
    </el-dialog>
    <el-dialog :visible.sync="shareVisible" title="文件分享" width="645px">
      <div class="shareCreate" v-if="!shareInfo.shareUrl">
        <el-form ref="shareform" label-width="70px">
          <el-form-item label="分享形式">
            <el-radio v-model="shareInfo.shareType" label="private">加密（输入提取码才能查看，下载）</el-radio>
            <el-radio v-model="shareInfo.shareType" label="open">公开（任何人访问链接即可查看，下载）</el-radio>
          </el-form-item>
          <el-form-item label>
            <el-button type="primary" @click="confirmCreateShare()">创建链接</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <div ckass="shareSuccess">
          <el-form label-width="70px">
            <el-form-item label="分享链接">
              <el-tag>
                {{shareInfo.shareUrl}}
              </el-tag>
            </el-form-item>
            <el-form-item label="密码" v-if="shareInfo.shareKey">{{shareInfo.shareKey}}</el-form-item>
            <el-form-item label="二维码">
              <div class="shareQrcode" style="text-align: center;" v-if="shareInfo.shareUrl">
                <img :src="shareQrcodeSrc" />
              </div>
            </el-form-item>
          </el-form>
        </div>

      </div>
    </el-dialog>

    <!-- 文件搜索框 -->
    <el-row type="flex" class="row-bg" v-if="openSearch">
      <el-input placeholder="请输入搜索的文件名" prefix-icon="el-icon-search" v-model="searchFileName"></el-input>
    </el-row>
    <div
      class="wait"
      v-loading="loading"
      style="height:calc(100% - 30%);"
    >
      <div class="displayContent">
        <el-table :data="filterUserFile" style="width: 100%">
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="name" label="文件名" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hash" label="Hash值" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="size" label="大小" width="120">
            <template slot-scope="scope">
              <span>{{renderSize(scope.row.size)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="上传时间" width="180"></el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button @click="fileShareButton(scope.row)" icon="el-icon-share" type="primary"
                         size="medium">分享</el-button>
              <el-button @click="fullDownloadUrl(scope.row)" icon="el-icon-download" type="success"
                         size="medium">下载</el-button>
              <el-button @click="fileDelete(scope.row)" icon="el-icon-delete" type="danger"
                         size="medium" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-main>
</template>

<script>
import axios from "axios";
import QRCode from "qrcode";
import { mapGetters } from 'vuex'
import fileApi from "../api/file";

export default {
  name: "netdiskContent",
  data() {
    return {
      visible: false,
      shareVisible: false,
      openSearch: true,
      searchFileName: "",
      userFileData: [],
      shareInfo: {
        id: null,
        shareType: "private",
        shareKey: null,
        shareUrl: null,
        shareStatus: false
      },
      shareQrcodeSrc: '',
      loading: true,
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    filterUserFile() {
      return this.userFileData.filter(v=> v.name.includes(this.searchFileName))
    },
  },
  methods: {
    //格式化文件大小
    renderSize(value){
      if(null==value || value===''){
        return "0 B";
      }
      const unitArr = ["B","KB","MB","GB","TB","PB","EB","ZB","YB"];
      let index=0;
      const srcsize = parseFloat(value);
      index=Math.floor(Math.log(srcsize)/Math.log(1024));
      let size =srcsize/Math.pow(1024,index);
      size=size.toFixed(2);//保留的小数位数
      return size+unitArr[index];
    },
    openUpload (){
      this.visible = true
    },
    close(){
      this.getUserFile()
    },
    handleSuccess(res, file) {
      const { success, msg, data } = res
      if (success) {
        this.$message1000('文件上传成功', 'success')
      } else {
        this.$message1000(msg, 'error')
      }
    },

    fullDownloadUrl(row) {
      axios({
        url: '/api/'+row.path,
        method:'get',
        responseType: 'blob'
      }).then(res=>{
        const url = URL.createObjectURL(res.data)
        const a = document.createElement('a')
        a.href = url
        a.download = row.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
    },
    fileDelete(row) {
      this.$confirm(`此操作将删除【${row.name}】文件, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          fileApi.deleteFile({ id: row.id }).then(res => {
            this.getUserFile()
            this.$message1000('删除成功');
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getUserFile(isRefresh) {
      this.loading = true
      fileApi.getFile().then(res => {
        this.userFileData = res.list.rows;
        if (isRefresh) {
          this.$message1000('刷新成功')
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    fileShareButton(row) {
      this.shareInfo = JSON.parse(JSON.stringify(row))
      if(row.shareUrl && !row.shareUrl.includes('share')){
        this.shareInfo["shareUrl"] = window.location.origin+'/#/s/'+row.shareUrl;
        this.makeQrcode(this.shareInfo.shareUrl).then(res=>{
          this.shareQrcodeSrc=res;
        });
      }
      this.shareVisible = true
    },
    confirmCreateShare() {
      const { id,shareStatus = '0',shareType } = this.shareInfo
      const params = {
        id,shareStatus,shareType
      }
      fileApi.createShare(params).then(res=>{
        this.$message1000('生成分享链接成功')
        this.shareInfo = res
        this.shareInfo.shareUrl = window.location.origin+'/#/s/'+res.shareUrl;
        this.makeQrcode(this.shareInfo.shareUrl).then(urlResult=>{
          this.shareQrcodeSrc = urlResult;
        });
      })
    },
    makeQrcode(url){
      return new Promise((resolve, reject)=>{
        QRCode.toDataURL(url, { width: 250 })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject("生成二维码错误：",err);
        });
      })
    }
  },
  created() {
    this.loading = true;
    this.getUserFile();
  },
  mounted() {

  }
};
</script>

<style>
  .el-upload-dragger{
    width: 600px;
  }
.row-bg {
  padding: 10px 0;
  border-bottom: 1px solid #dcdfe6;
}
.fileList {
  font-size: 14px;
}
.fileList .f_name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.fileList .f_ico {
  font-size: 18px;
  text-align: right;
}
.fileList .el-row:hover {
  background: #f3f5f9;
  box-shadow: inset 1px 1px 0px rgba(0, 0, 0, 0.05);
}
.fileList .f_name:hover {
  cursor: pointer;
}
.shareFile .shareMethod{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #08f;
    color: #fff;
    line-height: 40px;
    font-size: 20px;
    margin: auto;
    text-align: center;
}
.shareFile .shareUrlText{
    background-color: #D0F2C3;
    border-radius: 3px;
    padding: 13px 13px;
    font-size: 14px;
    margin: 15px 0;
    word-wrap: break-word;
    word-break: normal;
    text-align: left;
}
</style>
