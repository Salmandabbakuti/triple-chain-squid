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

export const BASE_USDC_ADDRESS =
  "0x951F55f0492a638Ff1d670aCd4B27b51CA0Ad4d1".toLowerCase();

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive("base-goerli")
    // Disabled for quests to avoid DDoSing Ankr :)
    // chain: "https://rpc.ankr.com/base"
  })
  .setFinalityConfirmation(75)
  .setFields({
    log: {
      transactionHash: true
    }
  })
  .setBlockRange({
    from: 5_918_310
  })
  .addLog({
    address: [BASE_USDC_ADDRESS],
    topic0: [erc20abi.events.Transfer.topic]
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Context = DataHandlerContext<Store, Fields>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
