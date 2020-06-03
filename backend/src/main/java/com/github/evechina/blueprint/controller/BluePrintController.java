package com.github.evechina.blueprint.controller;

import com.github.evechina.blueprint.service.BluePrintService;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.RoutingContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BluePrintController {

  private static final Logger log = LoggerFactory.getLogger(BluePrintController.class);

  private final BluePrintService bluePrintService = BluePrintService.getInstance();

  public static String mount(Vertx vertx, Router router) {
    BluePrintController controller = new BluePrintController();
    router.get().handler(controller::findAllByName);
    return "/blueprints";
  }

  private void findAllByName(RoutingContext ctx) {
    String name = ctx.request().getParam("name");
    bluePrintService.findAllByName(name).subscribe(bluePrints -> {
      ctx.response().end(Json.encode(bluePrints));
    }, e -> {
      log.error("按名称查询蓝图失败", e);
      JsonObject rsp = new JsonObject().put("msg", e.getMessage());
      ctx.response().setStatusCode(500).end(rsp.encodePrettily());
    });
  }

}
