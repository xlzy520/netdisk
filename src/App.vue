<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  }
}
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
.el-drawer.btt.createFolder,
.el-drawer.btt.editFolder {
  height: 100% !important;
  max-width: 640px;
  margin: 0 auto;
}
.el-drawer.btt.shareFile {
  position: absolute;
  top: 15%;
  height: 60%!important;
  margin: 0 auto;
  max-width: 400px;

}
.el-collapse-item :hover{
    background: #f0f9eb;
}
.el-collapse-item__header.is-active,.el-collapse-item__content{
    background: #f0f9eb;
}
@media only screen and (max-width: 796px) {
  .el-message-box {
    width: 260px !important;
  }
  .el-drawer.ltr {
    width: 60% !important;
  }
  .upload-demo,
  .el-upload,
  .el-upload-dragger {
    width: 100% !important;
  }
  .el-drawer.btt.shareFile{
    height: 70%!important;
  }
}
.el-tree-node__content >.is-leaf{
  color:red!important;
}
</style>
