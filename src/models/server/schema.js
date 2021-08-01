// Define your models and their properties
export const ServerSchemaName = 'Server';
const ServerSchema = {
  name: ServerSchemaName,
  properties: {
    url: 'string',
    user: 'string?',
    password: 'string?',
    // following should be moved under server database
    lastRoomsSynced: 'date',
    userId: 'string?',
    authToken: 'string?',
  },
};

export default ServerSchema;
