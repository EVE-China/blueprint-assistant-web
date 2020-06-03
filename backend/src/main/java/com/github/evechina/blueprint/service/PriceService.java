package com.github.evechina.blueprint.service;


import io.reactivex.Single;
import io.reactivex.schedulers.Schedulers;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.ext.web.client.WebClient;

import java.util.Objects;

/**
 * 价格服务类
 */
public class PriceService {

  private static PriceService instance = null;

  private final WebClient webClient;

  private PriceService(Vertx vertx) {
    this.webClient = WebClient.create(vertx);
  }

  public static void init(Vertx vertx) {
    instance = new PriceService(vertx);
  }

  public static PriceService getInstance() {
    return Objects.requireNonNull(instance, "请初始化后再调用");
  }

  private String getTypePriceUrl(int typeId) {
    return "https://www.ceve-market.org/api/market/region/10000002/system/30000142/type/" + typeId
      + ".json";
  }

  /**
   * 查询指定物品的最低卖价
   *
   * @param typeId typeId
   * @return 查询结果
   */
  public Single<JsonObject> query(int typeId) {
    String url = getTypePriceUrl(typeId);
    return webClient.getAbs(url)
      .putHeader(HttpHeaders.CONTENT_TYPE.toString(), "application/json")
      .rxSend().flatMap(rsp -> {
        JsonObject jsonObject = rsp.body().toJsonObject();
        return Single.just(jsonObject.getJsonObject("sell"));
      }).observeOn(Schedulers.io());
  }
}
