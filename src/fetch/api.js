import axios from 'axios';
import qs from '../../node_modules/qs/dist/qs';
import { Message } from 'element-ui';
import router from "../router/router.js"
import store from "../vuex/store.js";

// axios 配置
axios.defaults.timeout = 10000;
axios.defaults.baseURL = 'http://www.wangpan.com/public';

//POST传参序列化
axios.interceptors.request.use((config) => {
	let fileUpload=config.url=='/netdisk/api/file_upload'?true:false;
	if(fileUpload){
		config.headers.post['Content-Type'] = 'multipart/form-data;charset=UTF-8';
	}else{
		config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
	}
	if (config.method === 'post' && !fileUpload) {
		config.data['token']=store.getters.getUserInfo.token;
		config.data = qs.stringify(config.data);
	}
	return config;
}, (error) => {
	Message.error("错误的传参");
	return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use((res) => {
	if (res.status != 200) {
		return Promise.reject(res);
	}
	return res;
}, (error) => {
	switch (error.response.status) {
		case 400:
			Message.error('错误请求');
			break;
		case 401:
			Message.error('未授权，请重新登录');
			router.replace("/user/login");
			store.commit("quitUserInfo");
			break
		case 403:
			Message.error('拒绝访问');
			break
		case 404:
			Message.error('请求错误,未找到该资源');
			break
		case 405:
			Message.error('请求方法未允许');
			break
		case 408:
			Message.error('请求超时');
			break
		case 500:
			Message.error('服务器端出错');
			break
		case 501:
			Message.error('网络未实现');
			break
		case 502:
			Message.error('网络错误');
			break
		case 503:
			Message.error('服务不可用');
			break
		case 504:
			Message.error('网络超时');
			break
		case 505:
			Message.error('http版本不支持该请求');
			break
		default:
			Message.error(`连接错误${error.response.status}`);
	}
	return Promise.reject(error);
});
export function fetchPost(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, params)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err);
			})
			.catch((error) => {
				reject(error)
			})
	})
}

export function fetchGet(url, param) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: param
		})
			.then(response => {
				resolve(response.data)
			}, err => {
				reject(err)
			})
			.catch((error) => {
				reject(error)
			})
	})
}

export default {
	/**
	 * 用户登录
	 * @param username
     * @param password
     * @param captcha
	 */
	Login(params) {
		return fetchPost('/user/api/user_login', params);
	},
	/**
	 * 用户注册
	 */
	RegisterUser(params) {
		return fetchPost('/user/api/user_register', params);
	},
	/**
	 * 获取用户文件
	 * @param userId
	 * @param folder_id
	 */
	getUserFile(params) {
		return fetchPost('/netdisk/api/get_user_file', params);
	},
	/**
	 * 删除文件夹
	 * @param folder_id
	 * @param userId
	 */
	folderDelete(params) {
		return fetchPost('/netdisk/api/folder_delete', params);
	},
	/**
	 * 删除文件
	 * @param file_id
	 * @param userId
	 */
	fileDelete(params) {
		return fetchPost('/netdisk/api/file_delete', params);
	},
	/**
	 * 编辑文件夹
	 * @param folder_Id
	 * @param new_folder_name
	 */
	editFolder(params) {
		return fetchPost('/netdisk/api/edit_folder', params);
	},
	/**
	 * 创建文件夹
	 * @param new_folder_name
	 * @param userId
	 * @param folder_id 上一级文件夹的ID
	 */
	createFolder(params) {
		return fetchPost('/netdisk/api/folder_create', params);
	},
	/**
	 * 文件上传
	 * @param folder_id
	 * @param userId
	 */
	fileUpload(params) {
		return fetchPost('/netdisk/api/file_upload', params);
	},
	/**
	 * 创建分享
	 * @param userId
	 * @param file_id
	 * @param share_type
	 * @param expiry_date
	 */	
	createShare(params){
		return fetchPost('/netdisk/api/create_share', params);
	},
	/**
	 * 获取用户分享文件列表
	 * @param userId
	 */	
	getUserShareList(params){
		return fetchPost('/netdisk/api/share_list', params);
	},
	/**
	 * 删除分享文件
	 * @param share_id
	 */		
	deleteShare(params){
		return fetchPost('/netdisk/api/share_delete', params);
	},
	/**
	 * 获取分享信息
	 * @param shareUrl
	 */		
	getShareView(params){
		return fetchPost('/netdisk/api/share_view', params);
	}			
}
