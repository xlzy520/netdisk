<template>
  <el-main style="height:calc(100vh - 60px);padding-top:0;" justify="center">
    <!-- 导航位置 -->
    <el-row>
      <el-col>
        <span style="font-size:14px;">当前位置：</span>
        <el-tree
          style="margin-top: 5px;"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          node-key="folderId"
          :default-expanded-keys="expandArray"
          default-expand-all
          icon-class="el-icon-folder"
          ref="tree"
        ></el-tree>
      </el-col>
    </el-row>
    <!-- 上传 搜索 新建文件 -->
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="8">
        <el-button
          round
          type="success"
          icon="el-icon-upload"
          size="small"
          @click="openUpload=!openUpload"
        >上传</el-button>
      </el-col>
      <el-col :span="8">
        <el-button
          round
          type="success"
          icon="el-icon-search"
          size="small"
          @click="openSearch=!openSearch"
        >搜索</el-button>
      </el-col>
      <el-col :span="8">
        <el-button
          round
          type="success"
          icon="el-icon-folder-add"
          size="small"
          @click="createFolderButton()"
        >新建文件夹</el-button>
      </el-col>
    </el-row>
    <!-- 文件上传框 -->
    <el-row type="flex" class="row-bg" v-if="openUpload">
      <el-upload class="upload-demo" drag action="null" :http-request="uploadFile" multiple ref="upload-demo">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传rar/pdf/tet/jpg/png文件</div>
      </el-upload>
      <i
        class="el-icon-circle-close"
        style="font-size: 33px;color: #909399;cursor: pointer;"
        @click="openUpload=!openUpload"
      ></i>
    </el-row>
    <!-- 文件搜索框 -->
    <el-row type="flex" class="row-bg" v-if="openSearch">
      <el-input placeholder="请输入搜索的文件名" prefix-icon="el-icon-search" v-model="searchFileName"></el-input>
    </el-row>
    <!-- 数据懒加载 -->
    <div
      class="wait"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="height:calc(100% - 30%);"
    >
      <div class="displayContent" v-if="displayContent">
        <!-- 文件夹内容区 -->
        <el-row type="flex" class="row-bg" v-for="(item,index) in filterUserFolder" :key="item.Id">
          <el-col :span="24">
            <div class="fileList">
              <el-row type="flex" justify="center">
                <!-- 第一列文件夹的图标 -->
                <el-col :xs="4" :sm="2" :md="2" :lg="2">
                  <img :src="fullImgSrc('folder')" height="40" width="40" />
                </el-col>
                <el-col :xs="20" :sm="22" :md="22" :lg="22">
                  <!-- 第二列第一行 -->
                  <el-row type="flex" justify="center">
                    <el-col :xs="18" :sm="20" :md="20" :lg="20">
                      <div
                        class="f_name"
                        @click="enterFolderUrl(item['Folder'],item['Id'])"
                      >{{item['Folder']}}</div>
                    </el-col>
                    <el-col :xs="6" :sm="4" :md="4" :lg="4">
                      <div class="f_ico">
                        <!-- <i class="el-icon-share"></i>  -->
                        <i class="el-icon-edit" @click="editFolderButton(item,index)"></i>
                        <i
                          class="el-icon-delete"
                          style="color:red"
                          @click="folderDelete(item['Folder'],item['Id'],index,item['Path'])"
                        ></i>
                      </div>
                    </el-col>
                  </el-row>
                  <!-- 第二列第二行 -->
                  <el-row>
                    <el-col :span="24">
                      <el-row type="flex" justify="space-between">
                        <el-col :xs="20" :sm="20" :md="20" :lg="20">
                          <el-row>
                            <el-col :xs="8" :sm="16" :md="16" :lg="16">
                              <div class="f_size"></div>
                            </el-col>
                            <el-col :xs="16" :sm="16" :md="16" :lg="8">
                              <div class="f_time"></div>
                            </el-col>
                          </el-row>
                        </el-col>
                        <el-col :span="4" class="freePosition"></el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!-- 文件内容区 -->
        <el-row type="flex" class="row-bg" v-for="(item,index) in filterUserFile" :key="item.Id">
          <el-col :span="24">
            <div class="fileList">
              <el-row type="flex" justify="center">
                <el-col :xs="4" :sm="2" :md="2" :lg="2">
                  <img :src="fullImgSrc(item['File_ext'])" height="45" width="40" />
                </el-col>
                <el-col :xs="20" :sm="22" :md="22" :lg="22">
                  <!-- 第二列第一行 -->
                  <el-row type="flex" justify="center">
                    <el-col :xs="18" :sm="20" :md="20" :lg="20">
                      <div class="f_name">{{item['File_name']}}</div>
                    </el-col>
                    <el-col :xs="6" :sm="4" :md="4" :lg="4">
                      <div class="f_ico">
                        <i
                          class="el-icon-share"
                          @click="fileShareButton(item['User_id'],item['Id'],item['share_type'],item['expiry_date'],item['key'], item['share_url'],item['share_status'],index)"
                          style="cursor:pointer"
                        ></i>
                        <el-link
                          style="font-size: 18px;margin-top:-5px;color:inherit;"
                          :href="fullDownloadUrl(item['File_save_name'])"
                          icon="el-icon-download"
                          :download="item['File_name']"
                          :underline="false"
                        ></el-link>
                        <i
                          class="el-icon-delete"
                          style="color:red"
                          @click="fileDelete(item['File_name'],item['Id'],index,item['User_id'])"
                        ></i>
                      </div>
                    </el-col>
                  </el-row>
                  <!-- 第二列第二行 -->
                  <el-row style="padding-top:5px">
                    <el-col :span="24">
                      <el-row type="flex" justify="space-between">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24">
                          <el-row>
                            <el-col :xs="8" :sm="16" :md="16" :lg="16">
                              <div class="f_size">{{item['File_size']}}</div>
                            </el-col>
                            <el-col :xs="16" :sm="16" :md="16" :lg="8" >
                              <div class="f_time" style="text-align:right">{{item['Upload_time']}}</div>
                            </el-col>
                          </el-row>
                        </el-col>
                        <!-- <el-col :span="4" class="freePosition"></el-col> -->
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-row type="flex" class="row-bg">
          <el-col
            style="text-shadow: #FF0000 0 0 10px;font-size: 60px;font-weight: bold;color: white;position: relative;text-align: center;margin-top: 20%;"
          >该用户，空空如也</el-col>
        </el-row>
      </div>
    </div>
    <!-- Drawer 抽屉 -->
    <el-drawer
      :visible="$store.getters.getDrawerInfo['open']"
      :direction="$store.getters.getDrawerInfo['direction']"
      @close="closeDrawer()"
      @open="drawerActionQuery()"
      :custom-class="drawerAction"
    >
      <div
        class="addFolder editFolder shareFile"
        style="margin:0 20px;text-align:left"
        v-if="$store.getters.getDrawerInfo['direction']=='btt'"
      >
        <!-- 创建文件夹/编辑文件夹框 -->
        <div
          class="detailActi"
          v-if="(drawerAction=='createFolder') || (drawerAction=='editFolder')"
        >
          <h1 v-if="drawerAction=='createFolder'">添加文件夹</h1>
          <h1 v-else-if="drawerAction=='editFolder'">编辑文件夹</h1>
          <el-input placeholder="请输入文件夹名" v-model="newFolderName" style="margin:20px 0;">
            <template slot="prepend">
              <i class="el-icon-folder"></i>
            </template>
          </el-input>
          <!-- 判断用途是创建文件夹/编辑文件夹 -->
          <el-button
            type="success"
            @click="confirmCreateFolder()"
            v-if="drawerAction=='createFolder'"
          >添加</el-button>
          <el-button type="success" @click="confirmEditFolder()" v-else>修改</el-button>
          <el-button type="danger" @click="$store.commit('changeDrawer',[false])">关闭</el-button>
        </div>
        <!-- 文件分享框 -->
        <div v-else-if="drawerAction=='shareFile'">
          <div ckass="shareSuccess" v-if="shareInfo['share_status']">
            <el-row>
              <el-col>
                <div class="shareMethod">1</div>
              </el-col>
              <el-col >
                <div class="shareUrlText">{{shareInfo['share_url']}}
                  <br /><span v-if="shareInfo['key']">密码:{{shareInfo['key']}}</span></div>
              </el-col>
              <el-col>
                <div class="shareMethod">2</div>
              </el-col>
              <el-col>
                <div class="shareQrcode" style="text-align: center;">
                  <el-image :src="shareInfo['shareQrcodeSrc']" v-if="shareInfo['shareQrcodeSrc']"></el-image>
                </div>
              </el-col>
            </el-row>
            
            
          </div>
          <div class="shareCreate" v-else>
            <h1>分享文件</h1>
            <el-form ref="shareform" label-width="70px">
              <el-form-item label="分享形式">
                <el-radio v-model="shareInfo['share_type']" :label="'private'">加密（输入提取码才能查看，下载）</el-radio>
                <el-radio v-model="shareInfo['share_type']" :label="'open'">公开（任何人访问链接即可查看，下载）</el-radio>
              </el-form-item>
              <el-form-item label="有效期">
                <el-radio-group v-model="shareInfo['expiry_date']">
                  <el-radio :label="0">永久</el-radio>
                  <el-radio :label="7">7天</el-radio>
                  <el-radio :label="1">1天</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label>
                <el-button type="primary" @click="confirmCreateShare()">创建链接</el-button>
                <el-button @click="$store.commit('changeDrawer',[false])">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          

        </div>
      </div>
      <!-- 用户信息卡 -->
      <div class="userInfo" v-else>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h1>用户信息卡：</h1>
          </div>
          <div class="text item">
            <p>用户名：{{$store.getters.getUserInfo['Username']}}</p>
            <p>性别：{{$store.getters.getUserInfo['Sex']==null?'':($store.getters.getUserInfo['Sex']=='male'?'男':'女')}}</p>
            <p>专业：{{$store.getters.getUserInfo['Major']}}</p>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </el-main>
</template>

<script>
import api from "../fetch/api";
import axios from "axios";
import QRCode from "qrcode";
export default {
  name: "netdiskContent",
  data() {
    return {
      newFolderName: "",
      newFolderInfo: null,
      openSearch: true,
      openUpload: false,
      searchFileName: "",
      drawerAction: "createFolder",
      treeData: [
        {
          folderId: 0,
          folderName: "根目录",
        }
      ],
      defaultProps: {
        children: "subFolder",
        label: "folderName"
      },
      userFileData: null,
      shareInfo: {
        userId: null,
        file_id: null,
        share_type: "private",
        expiry_date: 0,
        key: null,
        share_url: null,
        shareQrcodeSrc: null,
        share_status: false
      },
      loading: true,
      displayContent:false,
      expandArray:[0]
    };
  },
  computed: {
    filterUserFile() {
      return (
        this.userFileData &&
        this.userFileData["fileData"]["file"].filter((item, value) => {
          return item["File_name"].includes(this.searchFileName);
        })
      );
    },
    filterUserFolder() {
      return (
        this.searchFileName == "" &&
        this.userFileData &&
        this.userFileData["fileData"]["folder"].filter((item, value) => {
          return true;
        })
      );
    }
  },
  watch: {
    "$route.params.folder_id"(newValue) {
      this.loading = true;
      this.displayContent = true;
      this.getUserFile();
      //浏览器后退的时候也有把导航位置更新了
      if(newValue==0){
        if(this.treeData[0].subFolder.length!=0){
          this.clearTreeData({folderId:newValue});
        }
      }
    }
  },
  methods: {
    clearTreeData(data){
      let treeDataStr=JSON.stringify(this.treeData).split(data.folderId)[1].match(/\d+/g);
      treeDataStr.forEach((item,index)=>{
        this.$refs.tree.remove(Number.parseInt(item),this.treeData);
      })
    },
    handleNodeClick(data) {
      if(data.folderId==this.$store.getters.getFromFolderId){
        return false;
      }
      let treeDataStr=JSON.stringify(this.treeData).split(data.folderId)[1].match(/\d+/g);
      treeDataStr.forEach((item,index)=>{
        this.$refs.tree.remove(Number.parseInt(item),this.treeData);
      })
      this.$router.replace(`/netdisk/folder_id/${data.folderId}`);
    },
    fullImgSrc(File_ext) {
      return `${axios.defaults.baseURL}/static/icon/${File_ext}.png`;
    },
    fullDownloadUrl(FileSaveName) {
      return `${axios.defaults.baseURL}/uploads/${FileSaveName}`;
    },
    folderDelete(folderName, folder_id, folderIndex, userId) {
      this.$confirm(`此操作将删除【${folderName}】文件夹, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .folderDelete({ folder_id, userId: userId.split("-")[0] })
            .then(res => {
              if (res.code == 1) {
                this.userFileData["fileData"]["folder"].splice(folderIndex, 1);
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    fileDelete(fileName, file_id, fileIndex, userId) {
      this.$confirm(`此操作将删除【${fileName}】文件, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.fileDelete({ file_id, userId }).then(res => {
            this.userFileData["fileData"]["file"].splice(fileIndex, 1);
            this.$message({
              type: "success",
              message: res.msg
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    createFolderButton() {
      this.$store.commit("changeDrawer", [true, "btt"]);
      this.drawerAction = "createFolder";
    },
    editFolderButton(folderInfo, folderIndex) {
      let tempFolderInfo = folderInfo;
      this.$store.commit("changeDrawer", [true, "btt"]);
      this.drawerAction = "editFolder";
      this.newFolderName = tempFolderInfo["Folder"];
      tempFolderInfo["index"] = folderIndex;
      this.newFolderInfo = tempFolderInfo;
    },
    confirmEditFolder() {
      api
        .editFolder({
          folder_Id: this.newFolderInfo.Id,
          new_folder_name: this.newFolderName
        })
        .then(res => {
          this.newFolderInfo["Folder"] = this.newFolderName;
          this.userFileData["fileData"]["folder"].splice(
            this.newFolderInfo["index"],
            1,
            this.newFolderInfo
          );
          this.$store.commit("changeDrawer", [false]);
          this.$message({
            type: "success",
            message: res.msg
          });
        });
    },
    confirmCreateFolder() {
      api
        .createFolder({
          folder_id: this.$store.getters.getFromFolderId,
          userId: this.$store.getters.getUserInfo.Id,
          new_folder_name: this.newFolderName
        })
        .then(res => {
          this.userFileData["fileData"]["folder"].push(res["new_folder_info"]);
          this.$store.commit("changeDrawer", [false]);
          this.$message({
            type: "success",
            message: res.msg
          });
        });
    },
    drawerActionQuery() {
      if (this.drawerAction == "createFolder") {
        this.newFolderName = "";
      } else {
      }
    },
    closeDrawer() {
      this.$store.commit("changeDrawer", [false]);
      this.newFolderName = "";
      this.newFolderInfo = null;
      this.shareInfo = {
        userId: null,
        file_id: null,
        share_type: "private",
        expiry_date: 0,
        key: null,
        share_url: null,
        shareQrcodeSrc: null,
        share_status: false
      };
    },
    enterFolderUrl(FolderName, FolderId) {
      let addData=this.$refs.tree.data[0];
      const newChild = {folderId:FolderId,folderName: FolderName, subFolder: [] };
      if (!addData.subFolder || addData.subFolder.length==0) {
        this.$set(addData, 'subFolder', []);
        addData.subFolder.push(newChild);  
      }else{
        this.$refs.tree.append({folderId:FolderId,folderName: FolderName},this.$store.getters.getFromFolderId);
      }
      this.expandArray=[this.$store.getters.getFromFolderId];
      this.$router.replace(`/netdisk/folder_id/${FolderId}`);
    },
    getUserFile() {
      //let [Id=userId,folder_id=0]=this.$store.getters.getUserInfo;
      api
        .getUserFile({ userId: this.$store.getters.getUserInfo.Id, folder_id: this.$route.params.folder_id })
        .then(res => {
          // console.log(res);
          // console.log(res["fileData"]["file"]);
          // console.log(res["fileData"]["folder"]);
          // console.log("result",res["fileData"]["file"]==res["fileData"]["folder"]);
          if (
            res["fileData"]["file"].length == 0 &&
            res["fileData"]["folder"].length == 0
          )
            this.displayContent = false;
          else this.displayContent = true;
          setTimeout(() => {
            this.loading = false;
            this.userFileData = res;
          }, 600);
        })
        .catch(error => {
          this.displayContent = false;
          this.loading = false;
          console.log(error);
        });
    },
    uploadFile(params) {
      let file = params.file;
      let form = new FormData();
      form.append("upload_file[]", file);
      form.append("userId", this.$store.getters.getUserInfo.Id);
      form.append("token", this.$store.getters.getUserInfo.token);
      form.append("folder_id", this.$store.getters.getFromFolderId);
      api
        .fileUpload(form)
        .then(res => {
          if (res["success"].length != 0) {
            this.userFileData["fileData"]["file"].push(...res["success"]);
            this.displayContent = true;
            this.$message({
              type: "success",
              message: "文件上传成功！！"
            });
            this.openUpload=false;
            this.$refs['upload-demo'].clearFiles();
          } else {
            console.log("文件上传错误啊!");
            res["error"].forEach((value,index) => {
                this.$message.error(`${value['File_name']}——${value['error_msg']}`);
            });
            this.$refs['upload-demo'].clearFiles();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    fileShareButton(
      UserId,
      fileId,
      sharType,
      expiryDate,
      key,
      shareUrl,
      shareStatus,
      fileIndex,
    ) {
      this.shareInfo["userId"] = UserId;
      this.shareInfo["file_id"] = fileId;
      this.shareInfo["share_type"] = sharType;
      this.shareInfo["expiry_date"] = expiryDate;
      this.shareInfo["key"] = key;
      if(shareUrl!=null && !shareUrl.includes('share')){
        this.shareInfo["share_url"] = window.location.origin+'/s/'+shareUrl;
      }
      if(shareStatus){
        this.makeQrcode(this.shareInfo["share_url"]).then(res=>{
          this.shareInfo["shareQrcodeSrc"]=res;
        });
      }      
      this.shareInfo["share_status"] = shareStatus;
      this.shareInfo["fileIndex"]=fileIndex;
      this.drawerAction = "shareFile";
      this.$store.commit("changeDrawer", [true, "btt"]);
    },
    confirmCreateShare() {
      let tempCreateShareParams={
        	userId:this.shareInfo["userId"],
          file_id:this.shareInfo["file_id"],
          share_type:this.shareInfo["share_type"],
          expiry_date:this.shareInfo["expiry_date"]
      }
      api.createShare(tempCreateShareParams).then(res=>{
          if(res.code==1){
            this.shareInfo["key"] = res['new_share_info']['key'];
            this.shareInfo["share_url"] = window.location.origin+'/s/'+res['new_share_info']['Share_url'];
            this.makeQrcode(this.shareInfo["share_url"]).then(urlResult=>{
              this.shareInfo["shareQrcodeSrc"]=urlResult;
            });
            this.shareInfo["share_status"] = true;
            this.$message.success(res.msg);
            //更改vuex中的文件分享状态
            this.$set(this.userFileData["fileData"]["file"][this.shareInfo["fileIndex"]],"share_status",true);
            this.$set(this.userFileData["fileData"]["file"][this.shareInfo["fileIndex"]],"key",this.shareInfo["key"]);
            this.$set(this.userFileData["fileData"]["file"][this.shareInfo["fileIndex"]],"share_url",this.shareInfo["share_url"]);
          }else{
            this.$message.error(res.msg);
          }
      }).catch(error=>{
        console.error("创建文件分享失败：",error);
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
    this.displayContent = true;
    this.getUserFile();
  },
  mounted() {

  }
};
</script>

<style scoped>
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