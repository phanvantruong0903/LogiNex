import {
  KAFKA_TOPIC,
  prismaAuth,
  Role,
  KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID,
  CreateProfileDto,
} from '@loginex/common';
import { ClientKafka } from '@nestjs/microservices';

const bcrypt = require('bcrypt');

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin.loginex@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin.loginex@gmail.com';

  const existingUser = await prismaAuth.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const user = await prismaAuth.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });

    const profileData: CreateProfileDto = {
      YOB: 2000,
      name: 'Admin LogiNex',
      accountId: user.id,
      role: Role.ADMIN,
    };

    const kafkaClient = new ClientKafka({
      client: {
        clientId: KAFKA_CLIENT_ID.AUTH_SERVICE,
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      },
      consumer: {
        groupId: KAFKA_GROUP_ID.AUTH_SERVICE,
      },
    });

    await kafkaClient.connect();
    kafkaClient.emit(KAFKA_TOPIC.USER_CREATED, {
      key: user.id,
      value: profileData,
    });

    await kafkaClient.close();
  } else {
    process.exit(0);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaAuth.$disconnect();
  });
