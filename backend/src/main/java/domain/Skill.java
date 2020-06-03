package domain;

/**
 * 技能
 * <p>
 * Fan 2020/5/22
 */
public class Skill extends Type {

  /**
   * 最少允许的技能等级
   */
  private final int minLevel;

  /**
   * 当前技能等级
   */
  private int level;

  public Skill(int id, String name, int minLevel, int level) {
    // 技能不关心体积
    super(id, name, 0f);
    this.minLevel = minLevel;
    this.level = level;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    if (level > minLevel) {
      throw new RuntimeException("不允许低于最低等级要求");
    }
    this.level = level;
  }
}
