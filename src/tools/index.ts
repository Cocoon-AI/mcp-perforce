import { fileOperationTools } from './file-operations.js';
import { changelistOperationTools } from './changelist-operations.js';
import { infoOperationTools } from './info-operations.js';
import { streamOperationTools } from './stream-operations.js';
import { clientOperationTools } from './client-operations.js';

export const allTools = [
  ...fileOperationTools,
  ...changelistOperationTools,
  ...infoOperationTools,
  ...streamOperationTools,
  ...clientOperationTools,
];

export {
  fileOperationTools,
  changelistOperationTools,
  infoOperationTools,
  streamOperationTools,
  clientOperationTools,
};