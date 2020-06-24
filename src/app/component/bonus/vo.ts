
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
  const bonus = new Bonus();
  if (null == item) {
    bonus.agencyFee = 0.0315;
    bonus.salesTax = 0.0225;
    bonus.systemCost = 0.15;
    return bonus;
  }
  return JSON.parse(item);
}
