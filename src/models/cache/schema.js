// Define your models and their properties
export const CacheSchemaName = 'Cache';
const CacheSchema = {
  name: CacheSchemaName,
  primaryKey: 'key',
  properties: {
    key: 'string', // table name + '::' + ID
    value: 'string', // json object serialized
    // following should be finalized
    dirty: { type: 'bool', default: false },
  },
};

export default CacheSchema;
