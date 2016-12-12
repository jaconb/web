package com.shikong.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;

import java.io.*;
import java.net.HttpURLConnection;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.*;


public class MessageUtil {

    //日志文件
    private static Logger logger = Logger.getLogger(MessageUtil.class);

	public static String getTime(){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		return sdf.format(new Date());
	}

	//生成随机数字
	public static String getRandomNum(int pwd_len){
		//35是因为数组是从0开始的，26个字母+10个数字
		final int  maxNum = 10;
		int i;  //生成的随机数
		int count = 0; //生成的密码的长度
		char[] str = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};

		StringBuffer pwd = new StringBuffer("");
		Random r = new Random();
		while(count < pwd_len){
			//生成随机数，取绝对值，防止生成负数，

			i = Math.abs(r.nextInt(maxNum));  //生成的数最大为36-1

			if (i >= 0 && i < str.length) {
				pwd.append(str[i]);
				count ++;
			}
		}

		return pwd.toString();
	}



	public final static String MD5(String s) {
		char hexDigits[] = { '0', '1', '2', '3', '4',
				'5', '6', '7', '8', '9',
				'a', 'b', 'c', 'd', 'e', 'f' };
		try {
			byte[] btInput = s.getBytes();
			//获得MD5摘要算法的 MessageDigest 对象
			MessageDigest mdInst = MessageDigest.getInstance("MD5");
			//使用指定的字节更新摘要
			mdInst.update(btInput);
			//获得密文
			byte[] md = mdInst.digest();
			//把密文转换成十六进制的字符串形式
			int j = md.length;
			char str[] = new char[j * 2];
			int k = 0;
			for (int i = 0; i < j; i++) {
				byte byte0 = md[i];
				str[k++] = hexDigits[byte0 >>> 4 & 0xf];
				str[k++] = hexDigits[byte0 & 0xf];
			}
			return new String(str);
		}
		catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static String agPath(String appID,String token){
		String ts = getTs();
		String sign = MD5(appID+ts+token+"sonneteck");
		return "?sign="+sign+"&ts="+ts+"&appID="+appID;
	}

    private static String serverUrl;

    static {
        Properties props = new Properties();
        InputStream isp = MessageUtil.class.getClassLoader().getResourceAsStream("config.properties");
        try {
            props.load(new InputStreamReader(isp, "utf-8"));
        } catch (IOException e) {
            logger.error("MessageUtil初始化服务器参数错误，异常如下：", e);
        }
        serverUrl =  props.getProperty("serverUrl");
    }

    private static String getTs(){

        HttpUtils httpUtils = new HttpUtils();

        String url = serverUrl+"v1/timestamp";

        HttpURLConnection con = null;

        try {
            con = httpUtils.sendRequest(url,"",HttpUtils.METHOD_GET);
            String result = httpUtils.getResponse(con);

            JSONObject message = JSON.parseObject(result);

            if(message.getInteger("code") == 0){
                return message.getString("content");
            }
        } catch (Exception e) {
            logger.error("MessageUtil获取时间戳，异常如下：", e);
        }

        return "";
    }
	
	public static void main(String[] args) throws Exception {
//		System.out.println(md5("111111"));
//		System.out.println(createToken());
//		MessageUtil t=new MessageUtil();
//		t.getTimeByDate();
//		System.out.println("****************************");
//		t.getTimeByCalendar();
//
//		System.out.println(System.getProperty("os.name"));
//		System.out.println(Class.class.getClass().getResource("/").getPath());


//		String jsonStr = "memberId=20&salemanId=2";
//		String path = "http://123.56.230.45:8081/bussiness/member/add?sign=3a7e5c262f97eff14241c690e1355e8f&ts=1452585357&appID=BAASTEST-C631-SMSS-BAAS-aE7C17JB42BS7";
//
//		System.out.println(sendPost(jsonStr,path));

//		String path = "http://123.56.230.45:8081/case/remind/memberlist?memberId=2222&pageNum=1&pageSize=5&sign=3a7e5c262f97eff14241c690e1355e8f&ts=1452585357&appID=BAASTEST-C631-SMSS-BAAS-aE7C17JB42BS7";
//		 /* Post Request */
//		Map dataMap = new HashMap();
//		dataMap.put("memberId", "111");
//		dataMap.put("salemanId", "111");
//		System.out.println(new HttpConnection().doPost(path, dataMap));


        /* Get Request */

//		String str = new HttpConnection().doGet(path);
//		JSONObject jsonObject = com.alibaba.fastjson.JSON.parseObject(str);
//
//		System.out.println(jsonObject.getString("code"));

		System.out.println(MessageUtil.MD5(MessageUtil.getRandomNum(6)));

	}




}
