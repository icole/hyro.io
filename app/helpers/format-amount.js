import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

export function formatAmount(amount/*, hash*/) {
  if (amount[0] && parseFloat(amount[0]) !== 0) {
    return htmlSafe(amount + "<img style=\"height: 26px\" src=\"/assets/images/eth.svg\" alt=\"\"/>");
  } else {
    return 'N/A';
  }
}

export default helper(formatAmount);
