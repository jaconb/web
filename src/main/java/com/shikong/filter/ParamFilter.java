package com.shikong.filter;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.shikong.utils.HttpUtils;
import com.shikong.utils.TokenUtils;
import org.apache.log4j.Logger;

import javax.servlet.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLDecoder;

/**
 * Title：
 * Author:black
 * Createtime:2016-08-22 17:07
 */
public class ParamFilter implements Filter {

    //日志文件
    private static Logger logger = Logger.getLogger(ParamFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        BufferedReader in = new BufferedReader(new InputStreamReader(servletRequest.getInputStream(), "utf-8"));
        String line;
        String jsons = "";
        while ((line = in.readLine()) != null) {
            jsons += line;
        }

        if("".equals(jsons) || jsons == null){
            servletResponse.setContentType("text/json;charset=UTF-8");
            servletResponse.setCharacterEncoding("UTF-8");
            servletResponse.getWriter().println(" {\"code\":\"-1\",\"message\":\"parameter lost\"}");
            return;
        }

        JSONObject jsonObject = JSON.parseObject(jsons);

        String method = jsonObject.getString("method");

        String serverName = jsonObject.getString("serverName");

        if("".equals(method) || method == null){
            method = HttpUtils.METHOD_GET;
        }

        method = method.toUpperCase();

        if("".equals(serverName) || serverName == null){
            servletResponse.setContentType("text/json;charset=UTF-8");
            servletResponse.setCharacterEncoding("UTF-8");
            servletResponse.getWriter().println(" {\"code\":\"-1\",\"message\":\"parameter[serverName] lost\"}");
            return;
        }

        String data = jsonObject.getString("data");

        servletRequest.setAttribute("method",method);
        servletRequest.setAttribute("serverName",serverName);
        servletRequest.setAttribute("data",data);

        filterChain.doFilter(servletRequest,servletResponse);
        return;

    }

    @Override
    public void destroy() {

    }
}
