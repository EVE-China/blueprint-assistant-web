package com.github.evechina.blueprint.service;

import io.vertx.reactivex.ext.sql.SQLClient;

import java.util.Objects;

/**
 * 蓝图服务类
 */
public class BluePrintService {

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
}
