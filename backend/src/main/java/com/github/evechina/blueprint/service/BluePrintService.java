package com.github.evechina.blueprint.service;

import domain.BluePrint;
import io.reactivex.Single;
import io.reactivex.schedulers.Schedulers;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.ext.sql.SQLClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * 蓝图服务类
 */
public class BluePrintService {

  private static final Logger log = LoggerFactory.getLogger(BluePrintService.class);

  private static BluePrintService instance;

  public static BluePrintService init(SQLClient client) {
    instance = new BluePrintService(client);
    return instance;
  }

  public static BluePrintService getInstance() {
    return Objects.requireNonNull(instance, "请初始化后再调用");
  }

  private final SQLClient client;

  private BluePrintService(SQLClient client) {
    this.client = client;
  }

  /**
   * 按照名称查询蓝图
   *
   * @param name 名称
   * @return 符合条件的蓝图
   */
  public Single<List<BluePrint>> findAllByName(String name) {
    String sql = "select bp.id, bp.maxProductionLimit, (select value from type_i18n where typeId = bp.id and key = 'name' and language = 'zh') AS name from blueprint bp where bp.id in (select typeId from type_i18n where key = 'name' and language = 'zh' and value like '%' || ? || '%');";
    JsonArray params = new JsonArray().add(name);
    return client.rxQueryWithParams(sql, params).flatMap(resultSet -> {
      try {
        List<JsonObject> rows = resultSet.getRows();
        List<BluePrint> bluePrints = new ArrayList<>(rows.size());
        for (JsonObject row : rows) {
          int id = row.getInteger("id");
          String bluePrintName = row.getString("name");
          int maxProductionLimit = row.getInteger("maxProductionLimit");
          BluePrint bluePrint = new BluePrint(id, bluePrintName, maxProductionLimit);
          bluePrints.add(bluePrint);
        }
        return Single.just(bluePrints);
      } catch (RuntimeException e) {
        return Single.error(new RuntimeException("按名称查询蓝图失败", e));
      }
    }).observeOn(Schedulers.io());
  }
}
