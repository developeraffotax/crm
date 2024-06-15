import axios from "axios";

import * as axiosURL from "./AxiosUrls";

var baseURL = axiosURL.BaseUrl;

export default axios.create({
  baseURL: baseURL,
});
