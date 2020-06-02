package com.github.evechina.blueprint.verticle;

import io.reactivex.Completable;
import io.vertx.reactivex.core.AbstractVerticle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 处理Http请求
 */
public class HttpVerticle extends AbstractVerticle {

  private static final Logger log = LoggerFactory.getLogger(HttpVerticle.class);

  @Override
  public Completable rxStart() {
    return vertx.createHttpServer().requestHandler(req -> {
      req.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!");
    }).rxListen(8080).doOnSuccess(http -> {
      log.info("HTTP server started on port {}.", http.actualPort());
    }).ignoreElement();
  }
}
