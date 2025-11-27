export const GRPC_SERVICES = {
  AUTH: 'AuthService',
  USER: 'UserService',
  INVENTORY: 'InventoryService',
  PRODUCT: 'ProductService',
} as const;

export const GRPC_PACKAGE = {
  AUTH: 'AUTH_PACKAGE',
  USER: 'USER_PACKAGE',
  INVENTORY: 'INVENTORY_PACKAGE',
  PRODUCT: 'PRODUCT_PACKAGE',
};

export const USER_METHODS = {
  CREATE: 'CreateUser',
  GET_ONE: 'GetUser',
  UPDATE: 'UpdateUser',
  GET_ALL: 'GetAllUsers',
  LOGIN: 'LoginUser',
  REFRESH_TOKEN: 'RefreshToken',
  CHANGE_PASSWORD: 'ChangePassword',
  CREATE_PROFILE: 'CreateProfile',
} as const;

export const PRODUCT_METHODS = {
  CREATE: 'CreateProduct',
  GET_ONE: 'GetProduct',
  UPDATE: 'UpdateProduct',
  GET_ALL: 'GetAllProducts',
  GET_DETAIL: 'GetProductDetail',
} as const;
