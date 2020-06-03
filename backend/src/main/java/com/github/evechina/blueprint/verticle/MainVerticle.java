package com.github.evechina.blueprint.verticle;

import com.github.evechina.blueprint.service.BluePrintService;
import com.github.evechina.blueprint.service.PriceService;
import io.reactivex.Completable;
import io.reactivex.Single;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Verticle;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.core.Vertx;
import io.vertx.reactivex.core.file.FileSystem;
import io.vertx.reactivex.ext.jdbc.JDBCClient;
import io.vertx.reactivex.ext.sql.SQLClient;

public class MainVerticle extends AbstractVerticle {

  private SQLClient client;

  @Override
  public Completable rxStart() {
    JsonObject config = getConfig();
    JsonObject jdbc = config.getJsonObject("jdbc");
    client = initSQLClient(vertx, jdbc);
    BluePrintService.init(client);
    PriceService.init(vertx);
    return deploy(new HttpVerticle()).ignoreElement();
  }

  @Override
  public Completable rxStop() {
    if (null != client) {
      return client.rxClose();
    }
    return Completable.complete();
  }

  private Single<String> deploy(Verticle verticle, DeploymentOptions options) {
    return vertx.rxDeployVerticle(verticle, options);
  }

  private Single<String> deploy(Verticle verticle) {
    DeploymentOptions deploymentOptions = new DeploymentOptions();
    deploymentOptions.setConfig(config());
    return deploy(verticle, deploymentOptions);
  }

  /**
   * 优先获取当前目录下的配置文件, 如果没有, 则从默认的config中获取
   *
   * @return 配置信息
   */
  private JsonObject getConfig() {
    String defaultPath = "conf/config.json";
    FileSystem fileSystem = vertx.fileSystem();
    if (fileSystem.existsBlocking(defaultPath)) {
      return fileSystem.readFileBlocking(defaultPath).toJsonObject();
    }
    JsonObject config = config();
    return config;
  }

  public static JDBCClient initSQLClient(Vertx vertx, JsonObject jdbcConfig) {
    if (null == jdbcConfig) {
      throw new RuntimeException("请配置数据源信息");
    }
    String providerClass = jdbcConfig.getString("provider_class");
    String url = jdbcConfig.getString("jdbcUrl");
    String driverClass = jdbcConfig.getString("driverClassName");
    int maxPoolSize = jdbcConfig.getInteger("maximumPoolSize", 30);
    JsonObject config = new JsonObject()
      .put("provider_class", providerClass)
      .put("jdbcUrl", url)
      .put("driverClassName", driverClass)
      .put("maximumPoolSize", maxPoolSize);
    return JDBCClient.createShared(vertx, config);
  }
}
