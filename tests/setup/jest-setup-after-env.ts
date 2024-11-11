import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test, type TestingModule, type TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { postgresConnectionUri } from '@src/configs/config';
import { type DatabasePool, createPool } from 'slonik';
import * as request from 'supertest';
import type TestAgent from 'supertest/lib/agent';

// Setting up test server and utilities

export class TestServer {
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly testingModule: TestingModule,
  ) {}

  public static async new(testingModuleBuilder: TestingModuleBuilder): Promise<TestServer> {
    const testingModule: TestingModule = await testingModuleBuilder.compile();

    const app: NestExpressApplication = testingModule.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    app.enableShutdownHooks();

    await app.init();

    return new TestServer(app, testingModule);
  }
}

let testServer: TestServer;
let pool: DatabasePool;

export async function generateTestingApplication(): Promise<{
  testServer: TestServer;
}> {
  const testServer = await TestServer.new(
    Test.createTestingModule({
      imports: [AppModule],
    }),
  );

  return {
    testServer,
  };
}

export function getTestServer(): TestServer {
  return testServer;
}

export function getConnectionPool(): DatabasePool {
  return pool;
}

export function getHttpServer(): TestAgent {
  const testServer = getTestServer();
  const httpServer = request(testServer.serverApplication.getHttpServer());

  return httpServer;
}

// setup
beforeAll(async (): Promise<void> => {
  ({ testServer } = await generateTestingApplication());
  pool = await createPool(postgresConnectionUri);
});

// cleanup
afterAll(async (): Promise<void> => {
  await pool.end();
  testServer.serverApplication.close();
});
