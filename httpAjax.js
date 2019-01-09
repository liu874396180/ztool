import "./Promise-extend.js";
import axios from "axios";

/**
 *
 * @param {string} method //get || post || put    .....
 * @param {string} url
 * @param {object} query //接口参数，key，value 对应
 * @param {object} config //可配置请求头等，请看下面的config注释
 */

function httpAjax(method, url, query, config, noCallback) {
	config = config ? config : {};
	method = method.toLowerCase(); //转小写
	switch (method) {
		case "get":
			//将get||delete请求传参处理成与post传参方式一致
			config = Object.assign(config, { params: query });
			break;
		case "delete":
			config = Object.assign(config, { data: query });
			break;
		case "location":
			window.location.assign(url);
			return;
		case "url":
			return url;
		case "url-promise":
			return Promise.resolve(url);
		case "post-params":
			method = "post";
			query =
				typeof query == "string"
					? query
					: Object.keys(query)
							.map((key) => {
								return `${key}=${query[key]}`;
							})
							.join("&");
			break;
	}

	let promise = noCallback
		? P
		: new Promise((resolve, reject) => {
				let P = null;
				switch (method) {
					case "get":
						P = axios[method](url, config);
						break;
					case "delete":
						P = axios[method](url, config);
						break;
					default:
						P = axios[method](url, query, config);
				}
				P &&
					P.then((result) => {
						if(result.data.code==403403){
							// const_notification("notification").error(result.data.msg?result.data.msg:"用户未登录或身份已过期");
							reject(result.data);
							return;
						}
						// 后台请求返回的code=0是操作成功
						result.data.code === 0 ? resolve(result.data) : reject(result.data);
					}).catch((result) => {
						// if (result.response.data.status === 499) {
						// 	if (window.rootVue) {
						// 		window.rootVue.$message.error("您的账号在别的地方登录");
						// 		window.rootVue.$router.replace({ name: "login" });
						// 	}
						// 	return;
						// }
						// if (result.response.data.status === 403) {
						// 	if (window.rootVue) {
						// 		window.rootVue.$message.error("登录过期，重新登录");
						// 		window.rootVue.$router.replace({ name: "login" });
						// 	}
						// 	return;
						// }
						reject(result.data);
					});
		  });
	return promise;
}
export default httpAjax;
