import { lookupArchive } from "@subsquid/archive-registry";
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction
} from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";
import * as erc20abi from "../abi/erc20";

export const BSC_USDC_ADDRESS =
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d".toLowerCase();

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive("binance"),
    chain: "https://rpc.ankr.com/bsc"
  })
  .setFinalityConfirmation(75)
  .setFields({
    log: {
      transactionHash: true
    }
  })
  .setBlockRange({
    from: 22_511_875
  })
  .addLog({
    address: [BSC_USDC_ADDRESS],
    topic0: [erc20abi.events.Transfer.topic]
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Context = DataHandlerContext<Store, Fields>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
