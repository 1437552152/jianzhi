/*
 * @Description: 
 * @Author: yfye
 * @Date: 2020-07-13 20:42:05
 * @LastEditTime: 2020-09-19 21:56:10
 * @LastEditors: yfye
 */
/**
 * 验收环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
/*   window.SITE_CONFIG['baseUrl'] = 'http://101.132.114.177:8090/renren-fast'; */
window.SITE_CONFIG['baseUrl'] = 'https://www.yyf2gml.site/renren-fast';
  window.SITE_CONFIG['upLoadUrl'] = 'https://www.yyf2gml.site';
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
