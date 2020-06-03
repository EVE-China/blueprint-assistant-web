package com.github.evechina.blueprint.verticle;

import com.github.evechina.blueprint.controller.BluePrintController;
import com.github.evechina.blueprint.controller.TypeController;
import io.reactivex.Completable;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.http.HttpServerResponse;
import io.vertx.reactivex.ext.web.Router;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.function.Function;

/**
 * 处理Http请求
 */
public class HttpVerticle extends AbstractVerticle {

  private static final Logger log = LoggerFactory.getLogger(HttpVerticle.class);

  @Override
  public Completable rxStart() {
    Router router = Router.router(vertx);
    router.route().handler(ctx -> {
      ctx.addHeadersEndHandler(unused -> {
        HttpServerResponse response = ctx.response();
        String header = response.headers().get(HttpHeaders.CONTENT_TYPE);
        // 如果没有设置, 则默认设置为json
        if (null == header || header.length() == 0) {
          response.putHeader(HttpHeaders.CONTENT_TYPE, "application/json");
        }
      });
      ctx.next();
    }).failureHandler(ctx -> {
      JsonObject rsp = new JsonObject();
      Throwable throwable = ctx.failure();
      log.error("捕获未处理异常", throwable);
      rsp.put("msg", null != throwable ? throwable.getMessage() : "未知错误");
      ctx.response().setStatusCode(500).end(rsp.encode());
    });
    mountSubRouter(router, sub -> BluePrintController.mount(vertx, sub));
    mountSubRouter(router, sub -> TypeController.mount(vertx, sub));
    return vertx.createHttpServer()
      .requestHandler(router)
      .rxListen(8080)
      .doOnSuccess(http -> log.info("HTTP server started on port {}.", http.actualPort()))
      .ignoreElement();
  }

  private void mountSubRouter(Router router, Function<Router, String> function) {
    Router sub = Router.router(vertx);
    String url = function.apply(sub);
    router.mountSubRouter(url, sub);
  }

}
