package com.github.evechina.blueprint.controller;

import com.github.evechina.blueprint.service.BluePrintService;
import io.vertx.core.json.Json;
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
    router.get("/:typeId/manufacturing").handler(controller::getManufacturingByTypeId);
    router.get().handler(controller::findAllByName);
    return "/blueprints";
  }

  private void findAllByName(RoutingContext ctx) {
    String name = ctx.request().getParam("name");
    bluePrintService.findAllByName(name).subscribe(bluePrints -> {
      ctx.response().end(Json.encode(bluePrints));
    }, ctx::fail);
  }

  private void getManufacturingByTypeId(RoutingContext ctx) {
    String typeIdStr = ctx.request().getParam("typeId");
    int typeId = 0;
    try {
      typeId = Integer.parseInt(typeIdStr);
    } catch (NumberFormatException e) {
      log.error("typeId非法", e);
      ctx.response().setStatusCode(500).end();
    }
    bluePrintService.getManufacturing(typeId).subscribe(manufacturing -> {
      ctx.response().end(Json.encode(manufacturing));
    }, ctx::fail);
  }

}
