package domain;

/**
 * 类型
 * <p>
 * Fan 2020/5/22
 */
public class Type {

  /**
   * 编号
   */
  private final int id;

  /**
   * 名称
   */
  private final String name;

  /**
   * 体积
   */
  private final float volume;

  public Type(int id, String name, float volume) {
    this.id = id;
    this.name = name;
    this.volume = volume;
  }

  public int getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public float getVolume() {
    return volume;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Type type = (Type) o;

    return id == type.id;
  }

  @Override
  public int hashCode() {
    return id;
  }
}
