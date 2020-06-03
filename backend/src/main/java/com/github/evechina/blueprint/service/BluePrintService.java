package com.github.evechina.blueprint.service;

import domain.*;
import io.reactivex.Single;
import io.reactivex.schedulers.Schedulers;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.ext.sql.SQLClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

  /**
   * 获取指定蓝图的制造业数据
   *
   * @param typeId 蓝图编号
   * @return 制造业数据
   */
  public Single<Manufacturing> getManufacturing(int typeId) {
    String sql = "select ba.time from blueprint_activity ba where ba.id = ? and ba.type = 2;";
    JsonArray params = new JsonArray().add(typeId);
    return client.rxQueryWithParams(sql, params).flatMap(resultSet -> {
      if (resultSet.getNumRows() == 0) {
        return Single.error(new RuntimeException("该蓝图不能进行制造"));
      }
      List<JsonObject> rows = resultSet.getRows();
      long time = rows.get(0).getLong("time");
      Manufacturing manufacturing = new Manufacturing();
      manufacturing.setTime(time);
      return Single.just(typeId).flatMap(id -> {
        // Materials
        return getBluePrintMaterials(id).flatMap(materials -> {
          manufacturing.setMaterials(materials);
          return Single.just(id);
        });
      }).flatMap(id -> {
        // Product
        return getBluePrintProduct(id).flatMap(product -> {
          manufacturing.setProduct(product);
          return Single.just(manufacturing);
        });
      });
    }).observeOn(Schedulers.io());
  }

  private Single<List<Item>> getBluePrintMaterials(int id) {
    String sql = "select bm.typeId as id, ti.value as name, t.volume, bm.quantity from blueprint_material bm left join type t on bm.typeId = t.id left join type_i18n ti on t.id = ti.typeId where bm.id = ? and bm.activityType = 2 and ti.language = 'zh' and ti.key = 'name';";
    List<Item> materials = new ArrayList<>();
    JsonArray params = new JsonArray().add(id);
    return client.rxQueryWithParams(sql, params).flatMap(resultSet -> {
      List<JsonObject> rows = resultSet.getRows();
      for (JsonObject row : rows) {
        int materialId = row.getInteger("id");
        String name = row.getString("name");
        float volume = row.getFloat("volume");
        Type type = new Type(materialId, name, volume);
        long quantity = row.getLong("quantity");
        materials.add(new Item(type, quantity));
      }
      return Single.just(materials);
    });
  }

  /**
   * 暂时不涉及技能
   */
  private Map<Skill, Integer> getBluePrintSkills(int id) {
    /*String sql = "select bs.typeId as id, ti.value as name, bs.level as level from blueprint_skill bs left join type_i18n ti on bs.typeId = ti.typeId where bs.id = ? and bs.activityType = 2 and ti.language = 'zh' and ti.key = 'name';";
    Map<Skill, Integer> skills = new HashMap<>();
    try (PreparedStatement prepareStatement = connection.prepareStatement(sql)) {
      prepareStatement.setInt(1, id);
      ResultSet resultSet = prepareStatement.executeQuery();
      while (resultSet.next()) {
        int skillId = resultSet.getInt("id");
        String name = resultSet.getString("name");
        int level = resultSet.getInt("level");
        Skill skill = new Skill(skillId, name, level, level);
        skills.put(skill, level);
      }
      resultSet.close();
      return skills;
    } catch (SQLException e) {
      throw new ProjectException("查询蓝图技能失败", e);
    }*/
    return null;
  }

  private Single<Item> getBluePrintProduct(int id) {
    String sql = "select bp.typeId as id, ti.value as name, t.volume as volume, bp.quantity as quantity from blueprint_product bp left join type t on bp.typeId = t.id left join type_i18n ti on bp.typeId = ti.typeId where bp.id = ? and bp.activityType = 2 and ti.language = 'zh' and ti.key = 'name';";
    JsonArray params = new JsonArray().add(id);
    return client.rxQueryWithParams(sql, params).flatMap(resultSet -> {
      List<JsonObject> rows = resultSet.getRows();
      JsonObject row = rows.get(0);
      int productId = row.getInteger("id");
      String productName = row.getString("name");
      float volume = row.getFloat("volume");
      long quantity = row.getLong("quantity");
      Type type = new Type(productId, productName, volume);
      Item item = new Item(type, quantity);
      return Single.just(item);
    });
  }
}
