import dayjs from "dayjs";
import { clone } from "@pureadmin/utils";
import axios from "axios";
import { getToken, formatToken } from "@/utils/auth";
const date = dayjs(new Date()).format("YYYY-MM-DD");

const tokenData = getToken();
const token = tokenData.token;




