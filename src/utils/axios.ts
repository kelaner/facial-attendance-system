import axios, {AxiosRequestConfig} from "axios";


const axiosInstance = axios.create({baseURL: "http://101.200.210.137:8080"});


axiosInstance.interceptors.response.use(
	res => res,
	error => Promise.reject(( error.response && error.response.data ) || "请求异常")
);

axiosInstance.interceptors.request.use(req => {
	req.headers[ "Content-Type" ] = "application/json"
	req.baseURL = "http://101.200.210.137:8080"


	return req;
});

export default axiosInstance;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
	const [url, config] = Array.isArray(args) ? args : [args];

	const res = await axiosInstance.get(url, {...config});

	return res.data;
};

