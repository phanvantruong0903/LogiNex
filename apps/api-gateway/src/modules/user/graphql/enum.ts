import { registerEnumType } from '@nestjs/graphql';
import { Role, UserVerifyStatus } from '@mebike/common'; // Thay thế bằng đường dẫn chính xác

registerEnumType(Role, {
  name: 'Role',
  description: 'Vai trò của người dùng',
});

registerEnumType(UserVerifyStatus, {
  name: 'UserVerifyStatus',
  description: 'Trạng thái xác thực của người dùng',
});
