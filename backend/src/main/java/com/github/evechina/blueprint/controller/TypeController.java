package com.github.evechina.blueprint.controller;

import com.github.evechina.blueprint.service.PriceService;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.web.Router;
import io.vertx.reactivex.ext.web.RoutingContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TypeController {

  private static final Logger log = LoggerFactory.getLogger(TypeController.class);

  private final PriceService priceService = PriceService.getInstance();

  public static String mount(Vertx vertx, Router router) {
    TypeController controller = new TypeController();
    router.get("/:typeId/price").handler(controller::getPrice);
    return "/type";
  }

  private void getPrice(RoutingContext ctx) {
    String typeIdStr = ctx.request().getParam("typeId");
    int typeId = 0;
    try {
      typeId = Integer.parseInt(typeIdStr);
    } catch (NumberFormatException e) {
      log.error("typeId非法", e);
      ctx.response().setStatusCode(500).end();
    }
    priceService.query(typeId).subscribe(detail -> {
      ctx.response().end(detail.encode());
    }, ctx::fail);
  }

}
