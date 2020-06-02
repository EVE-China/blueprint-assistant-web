package com.github.evechina.blueprint.verticle;

import com.github.evechina.blueprint.service.BluePrintService;
import io.reactivex.Completable;
import io.reactivex.Single;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Promise;
import io.vertx.core.Verticle;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.core.AbstractVerticle;
import io.vertx.reactivex.ext.jdbc.JDBCClient;
import io.vertx.reactivex.ext.sql.SQLClient;

public class MainVerticle extends AbstractVerticle {

  private SQLClient client;

  @Override
  public Completable rxStart() {
    JsonObject jdbc = config().getJsonObject("jdbc");
    initSQLClient(jdbc);
    BluePrintService.init(client);
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

  private void initSQLClient(JsonObject jdbcConfig) {
    String url = jdbcConfig.getString("url");
    String driverClass = jdbcConfig.getString("driver_class");
    int maxPoolSize = jdbcConfig.getInteger("max_pool_size", 30);
    JsonObject config = new JsonObject()
      .put("jdbcUrl", url)
      .put("driverClassName", driverClass)
      .put("maximumPoolSize", maxPoolSize);
    client = JDBCClient.createShared(vertx, config);
  }
}
