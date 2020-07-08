
export class Bonus {

  /**
   * 中介费
   */
  agencyFee: number;

  /**
   * 销售税
   */
  salesTax: number;

  /**
   * 星系成本
   */
  systemCost: number;

  /**
   * 设施税
   */
  facilityTax: number;

  public toJson(): string {
    return JSON.stringify(this);
  }
}

const BONUS_KEY = 'bonus';

export function saveBonus(bonus: Bonus) {
  localStorage.setItem(BONUS_KEY, bonus.toJson());
}

export function getBonus(): Bonus {
  const item = localStorage.getItem(BONUS_KEY);
  let bonus = null;
  if (null == item) {
    bonus = new Bonus();
    bonus.agencyFee = 0.0315;
    bonus.salesTax = 0.0225;
    bonus.systemCost = 0.15;
    bonus.facilityTax = 0.10;
    return bonus;
  }
  bonus = JSON.parse(item) as Bonus;
  if (null == bonus.agencyFee) {
    bonus.agencyFee = 0.0315;
  }
  if (null == bonus.salesTax) {
    bonus.salesTax = 0.0225;
  }
  if (null == bonus.systemCost) {
    bonus.systemCost = 0.15;
  }
  if (null == bonus.facilityTax) {
    bonus.facilityTax = 0.10;
  }
  return bonus;
}
