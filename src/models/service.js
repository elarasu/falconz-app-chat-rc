// Define your models and their properties
const ServiceSchema = {
  name: 'Service',
  properties: {
    url: 'string',
    lastRoomsSynced: 'date',
    user: 'string?',
    password: 'string?',
    userId: 'string?',
    authToken: 'string?',
  },
};

export default ServiceSchema;
