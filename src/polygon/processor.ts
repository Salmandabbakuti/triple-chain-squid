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

export const POLYGON_USDC_ADDRESS =
  "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359".toLowerCase();

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive("polygon"),
    chain: "https://rpc.ankr.com/polygon"
  })
  .setFinalityConfirmation(75)
  .setFields({
    log: {
      transactionHash: true
    }
  })
  .setBlockRange({
    from: 38_592_479
  })
  .addLog({
    address: [POLYGON_USDC_ADDRESS],
    topic0: [erc20abi.events.Transfer.topic]
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Context = DataHandlerContext<Store, Fields>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
