/** @decorator */

import { html, observable, when } from '../../../vendor/fast-element.min.js';
import { uuidv4 } from '../../../lib/ppp-crypto.js';
import { formatPrice } from '../../../lib/intl.js';
import { Column, columnStyles } from './column.js';
import { TRADER_DATUM } from '../../../lib/const.js';
import { level1TraderCondition } from '../order.js';

export const columnTemplate = html`
  <template>
    ${when((x) => x.isBalance, html`<span></span>`)}
    ${when(
      (x) => !x.isBalance,
      html`
        <span class="negative">
          ${(cell) => formatPrice(cell.bestAsk, cell.datum?.instrument)}
        </span>
      `
    )}
  </template>
`;

export class BestAskColumn extends Column {
  @observable
  bestAsk;

  async connectedCallback() {
    await super.connectedCallback();

    if (this.trader && !this.isBalance) {
      await this.trader.subscribeFields?.({
        source: this,
        fieldDatumPairs: {
          bestAsk: TRADER_DATUM.BEST_ASK
        },
        condition: level1TraderCondition
      });
    }

    if (this.extraTrader && !this.isBalance) {
      await this.extraTrader.subscribeFields?.({
        source: this,
        fieldDatumPairs: {
          bestAsk: TRADER_DATUM.BEST_ASK
        },
        condition: level1TraderCondition
      });
    }
  }

  async disconnectedCallback() {
    if (this.trader && !this.isBalance) {
      await this.trader.unsubscribeFields?.({
        source: this,
        fieldDatumPairs: {
          bestAsk: TRADER_DATUM.BEST_ASK
        }
      });
    }

    if (this.extraTrader && !this.isBalance) {
      await this.extraTrader.unsubscribeFields?.({
        source: this,
        fieldDatumPairs: {
          bestAsk: TRADER_DATUM.BEST_ASK
        }
      });
    }

    super.disconnectedCallback();
  }
}

// noinspection JSVoidFunctionReturnValueUsed
export default BestAskColumn.compose({
  name: `ppp-${uuidv4()}`,
  template: columnTemplate,
  styles: columnStyles
}).define();
