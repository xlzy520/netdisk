<template>
  <div class="shareViewBox">
    <div class="shareFileView" v-if="isShareUrl && hasData">
      <div class="needPassword" v-if="userShareView['Share_type']=='private'">
        <i class="el-icon-warning-outline"></i>
        <p>文件受密码保护，请输入密码继续下载</p>
        <el-input
          placeholder="请输入提取码"
          v-model="key"
          show-password
          style="width: 50%;text-align:center"
        ></el-input>
        <el-button type="primary" @click="checkShareKey" :disabled="disabled">确认</el-button>
      </div>
      <div class="noPaswword" v-else-if="userShareView['Share_type']=='open'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{userShareView.File_name}}</span>
          </div>
          <div class="text item" style="text-align:left">
            <p>文件大小：{{userShareView.File_size}}</p>
            <p>分享时间：{{userShareView.Share_date}}</p>
            <p>分享用户：{{userShareView.User_name | userNameHidden}}</p>
            <p>失效时间：{{calcExpiryTime()}}</p>
            <p style="text-align:center">
              <el-link
                :href="fullDownloadUrl(userShareView['File_save_name'])"
                :download="userShareView['File_name']"
                :underline="false"
              >
                <el-button type="danger" icon="el-icon-download">下载</el-button>
              </el-link>
            </p>
          </div>
        </el-card>
      </div>
    </div>
    <div class="shareNoFound" v-else>
      <i class="el-icon-warning-outline"></i>
      <p style="color: #b3b3b3;">来晚啦...文件取消分享了</p>
    </div>
  </div>
</template>

<script>
import api from "../fetch/api";
import axios from "axios";
import moment from "moment";
export default {
  name: "shareView",
  data() {
    return {
      isShareUrl: false,
      userShareView: null,
      hasData: false,
      key: "",
      disabled: false
    };
  },
  filters: {
    userNameHidden(oldUserName) {
      //$1返回的是匹配的全部结果
      //$2返回的是第一个框号的结果
      //$3返回的是第一个框号的结果
      return (
        oldUserName &&
        oldUserName.replace(/(.)(.+)/g, ($1, $2, $3) => {
          return $2 + "*".repeat($3.length);
        })
      );
    }
  },
  watch: {
    "$route.params.shareUrl"() {
      if (this.checkShareUrl()) {
        this.getUserShareView();
      }
    }
  },
  computed: {},
  methods: {
    checkShareUrl() {
      let shareUrl = this.$route.params.shareUrl;
      //判断分享的ID中是否是字母/数字，还ID长度是不是5/6
      if (
        /\W/g.test(shareUrl) ||
        !(shareUrl.length == 5 || shareUrl.length == 6)
      )
        this.isShareUrl = false;
      else this.isShareUrl = true;
      return this.isShareUrl;
    },
    getUserShareView() {
      api
        .getShareView({ shareUrl: this.$route.params.shareUrl })
        .then(res => {
          if (Object.keys(res).length == 0 || res["Share_status"] == false)
            this.isShareUrl = false;
          else this.isShareUrl = true;
          this.userShareView = res;
          this.hasData = true;
        })
        .catch(error => {
          this.isShareUrl = false;
          this.hasData = false;
          console.log("获取用户分享查看失败；", error);
        });
    },
    checkShareKey() {
      this.disabled = true;
      if (this.key == this.userShareView["key"]) {
        this.userShareView["Share_type"] = "open";
      } else {
        this.$notify.error({
          title: "错误",
          message: "提取码错误！",
          duration: 2000,
          onClose: () => {
            this.disabled = false;
            this.key = "";
          }
        });
      }
    },
    fullDownloadUrl(FileSaveName) {
      return `${axios.defaults.baseURL}/uploads/${FileSaveName}`;
    },
    calcExpiryTime() {
      if (Object.keys(this.userShareView).length != 0) {
        if (this.userShareView["Expiry_date"] == 0) {
          return "永久有效";
        } else {
          moment.locale("zh-cn", {
            relativeTime: {
              future: "%s后",
              past: "%s前",
              s: "几秒",
              ss: "%d秒",
              m: "1分钟",
              mm: "%d分钟",
              h: "1小时",
              hh: "%d小时",
              d: "1天",
              dd: "%d天",
              M: "1个月",
              MM: "%d个月",
              y: "1年",
              yy: "%d年"
            }
          });
          return moment(
            moment
              .unix(Number.parseInt(this.userShareView["Share_date"]))
              .format("YYYY-MM-DD HH:mm:ss")
          )
            .add(this.userShareView["Expiry_date"], "day")
            .from();
        }
      }
    }
  },
  created() {
    if (this.checkShareUrl()) {
      this.getUserShareView();
    }
  }
};
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