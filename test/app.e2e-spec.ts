import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthLoginDto, AuthSignupDto } from 'src/auth/dto';

describe('Application e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const serverPort = 5555;

  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(serverPort);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();

    pactum.request.setBaseUrl(`http://localhost:${serverPort}/api/v1`);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      test('Should Signup', () => {
        const reqBody: AuthSignupDto = {
          email: 'gallottohugo@gmail.com',
          password: '',
          username: 'gallottohugo',
          firstName: 'Hugo',
          lastName: 'Gallotto',
        };
        pactum.spec().post('/auth/signup').withBody(reqBody).expectStatus(201);
      });

      test('Should fail if body is empty', () => {
        pactum.spec().post('/auth/signup').withBody({}).expectStatus(400);
      });
    });

    describe('Login', () => {
      const reqBody: AuthLoginDto = {
        password: '123456',
        username: 'gallottohugo',
      };

      test('Should login', async () => {
        pactum.spec().post('/auth/login').withBody(reqBody).expectStatus(301);
      });

      test('Should fail if username is empty', () => {
        pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: reqBody.password })
          .expectStatus(400);
      });

      test('Should fail if password is empty', () => {
        pactum
          .spec()
          .post('/auth/login')
          .withBody({ username: reqBody.username })
          .expectStatus(400);
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it.todo('should ok');
    });

    describe('Edit User', () => {
      it.todo('should ok');
    });
  });

  describe('Boomarks', () => {
    describe('Create Bookmark', () => {
      it.todo('should ok');
    });

    describe('Get Bookmarks', () => {
      it.todo('should ok');
    });

    describe('Get Bookmark by id', () => {
      it.todo('should ok');
    });

    describe('Edit Bookmark by id', () => {
      it.todo('should ok');
    });

    describe('Delete Bookmark', () => {
      it.todo('should ok');
    });
  });
});
